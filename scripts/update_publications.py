#!/usr/bin/env python3
"""Conservatively refresh incomplete publication records from publisher-deposited Crossref data."""
from __future__ import annotations

import argparse
import copy
import hashlib
import html
import json
import re
import sys
import time
import unicodedata
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import quote, unquote, urljoin, urlsplit

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA = Path('_data/publications.json')
REPORT = Path('_data/publication_checks.json')
MONTHS = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
DOI_PATTERN = re.compile(r'10\.\d{4,9}/[^\s<>"\u201c\u201d]+', re.I)
PUBLISHERS = ('ieeexplore.ieee.org', 'www.sciencedirect.com', 'api.elsevier.com',
              'onlinelibrary.wiley.com', 'link.springer.com', 'www.ieee-jas.net',
              'ieee-jas.net', 'www.ship-research.com', 'ship-research.com')
USER_AGENT = 'PublicationUpdater/1.0 (https://github.com/wtwu95/wtwu95.github.io; mailto:wtwu95@gmail.com)'


def clean(value) -> str:
    return BeautifulSoup(str(value or ''), 'html.parser').get_text(' ', strip=True)


def normalize(value: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFKD', value).casefold() if c.isalnum())


def doi_from(value: str) -> str:
    match = DOI_PATTERN.search(unquote(value))
    return match.group(0).rstrip('.,;)').lower() if match else ''


def parse_record(entry: dict) -> dict:
    soup = BeautifulSoup(entry['body_html'], 'html.parser')
    paragraph = soup.find('p')
    venue = paragraph.find('em') if paragraph else None
    title_match = re.search(r'“(.*?)”', paragraph.get_text(' ', strip=True) if paragraph else '')
    if not paragraph or not venue or not title_match:
        raise ValueError('Expected a paragraph with a quoted title and venue')
    title = title_match.group(1).strip().rstrip(',').strip()
    author_text = paragraph.get_text(' ', strip=True).split('“', 1)[0].rstrip(' ,')
    author_text = re.sub(r'\s+([,;:.])', r'\1', author_text)
    author_names = [s.strip() for s in re.split(r',|\band\b|，|、', author_text) if s.strip()]
    tail = ''.join(str(node) for node in venue.next_siblings)
    text = BeautifulSoup(tail, 'html.parser').get_text(' ', strip=True)
    info = {}
    for key, pattern in [('volume', r'\bvol\.\s*([\w-]+)'), ('issue', r'\bno\.\s*([\w-]+)'),
                         ('pages', r'\bpp?\.\s*([\w]+(?:[–—-][\w]+)?)'),
                         ('article_number', r'\bart\.\s*([\w-]+)')]:
        match = re.search(pattern, text)
        if match:
            info[key] = match.group(1).replace('–', '-').replace('—', '-')
    years = re.findall(r'\b(?:19|20)\d{2}\b', text.split('doi:', 1)[0])
    info['year'] = years[-1] if years else str(entry.get('year', ''))
    info['month'] = next((i for i, m in enumerate(MONTHS) if m and m in text), None)
    if entry['type'] == 'conference' and re.search(r'\bIEEE\b', text):
        info['publisher'] = 'IEEE'
    info['doi'] = doi_from(str(entry.get('metadata', {}).get('doi', '')) or entry['body_html'])
    resources = [a for a in paragraph.find_all('a') if a.find('img')]
    return dict(soup=soup, paragraph=paragraph, venue=venue, title=title,
                author_text=author_text, authors=author_names, info=info,
                resources=resources, pending=bool(re.search(r'early access|accepted|in press|to appear', text, re.I)),
                notes=re.findall(r'\[[^\]]+\]', text))


def local_resource(root: Path, href: str) -> Path | None:
    url = urlsplit(href)
    if url.scheme or url.netloc or not url.path.startswith('/assets/'):
        return None
    path = (root / unquote(url.path).lstrip('/')).resolve()
    return path if path.is_relative_to(root.resolve()) else None


def issues_for(entry: dict, record: dict, root: Path) -> list[str]:
    info = record['info']
    issues = [f'missing_{key}' for key in ('doi', 'year') if not info.get(key)]
    if entry['type'] in ('journal', 'review') and not info.get('volume'):
        issues.append('missing_volume')
    if not (info.get('pages') or info.get('article_number')):
        issues.append('missing_pages_or_article_number')
    if record['pending']:
        issues.append('awaiting_final_publication')
    if info.get('year') != str(entry.get('year', '')):
        issues.append('inconsistent_year')
    if not any('pdf' in a.find('img').get('alt', '').lower() for a in record['resources']):
        issues.append('missing_pdf_resource')
    date = str(entry.get('date', ''))
    if date and (date[:4] != info.get('year') or
                 (info.get('month') and date[:7] != f"{info['year']}-{info['month']:02d}")):
        issues.append('inconsistent_date')
    for resource in record['resources']:
        href = resource.get('data-missing-local-file') or resource.get('href', '')
        path = local_resource(root, href)
        if path and not path.is_file():
            issues.append('missing_file:' + href)
        elif resource.has_attr('data-needs-public-pdf'):
            issues.append('public_pdf_not_yet_available')
    return issues


def author_key(name: str) -> tuple[str, str]:
    parts = name.split()
    return (normalize(parts[-1]), normalize(parts[0])[:1]) if parts else ('', '')


def matches(record: dict, work: dict, entry_type: str) -> bool:
    wanted_type = 'proceedings-article' if entry_type == 'conference' else 'journal-article'
    if work.get('type') != wanted_type:
        return False
    title = clean((work.get('title') or [''])[0])
    if SequenceMatcher(None, normalize(record['title']), normalize(title)).ratio() < 0.96:
        return False
    venue = clean((work.get('container-title') or [''])[0])
    if SequenceMatcher(None, normalize(record['venue'].get_text()), normalize(venue)).ratio() < 0.88:
        return False
    authors = [(normalize(str(a.get('family', ''))), normalize(str(a.get('given', '')))[:1])
               for a in work.get('author', [])]
    local_authors = [author_key(name) for name in record['authors']]
    if not local_authors or local_authors[0] not in authors:
        return False
    if sum(key in authors for key in local_authors) < min(2, len(local_authors)):
        return False
    doi = doi_from(str(work.get('DOI', '')))
    return bool(doi and (not record['info']['doi'] or record['info']['doi'] == doi))


def safe_publisher_url(url: str) -> bool:
    try:
        parts = urlsplit(url)
        return (parts.scheme == 'https' and parts.hostname in PUBLISHERS and
                not parts.username and not parts.password and parts.port in (None, 443) and
                not re.search(r'(?:token|signature|expires|api[_-]?key)=', parts.query, re.I))
    except ValueError:
        return False


class Client:
    def __init__(self, delay: float = 1.0):
        self.session = requests.Session()
        self.session.headers['User-Agent'] = USER_AGENT
        self.delay = delay
        self.last_call = 0.0

    def metadata(self, path: str, params: dict | None = None) -> dict:
        for attempt in range(3):
            time.sleep(max(0, self.delay - (time.monotonic() - self.last_call)))
            self.last_call = time.monotonic()
            response = self.session.get('https://api.crossref.org/works' + path,
                                        params=params, timeout=25)
            if response.status_code == 404:
                return {}
            if response.status_code in (429, 502, 503, 504) and attempt < 2:
                time.sleep(min(5, 2 ** attempt))
                continue
            response.raise_for_status()
            message = response.json().get('message')
            if not isinstance(message, dict):
                raise ValueError('Invalid Crossref response')
            return message
        return {}

    def lookup(self, entry: dict, record: dict) -> tuple[dict | None, str]:
        doi = record['info']['doi']
        if doi:
            work = self.metadata('/' + quote(doi, safe=''))
            return (work, 'matched') if matches(record, work, entry['type']) else (None, 'unverified_doi')
        result = self.metadata('', {'query.bibliographic': record['title'], 'rows': 5,
                                    'filter': 'type:' + ('proceedings-article' if entry['type'] == 'conference' else 'journal-article')})
        candidates = {doi_from(str(w.get('DOI', ''))): w for w in result.get('items', [])
                      if matches(record, w, entry['type'])}
        if len(candidates) != 1:
            return None, 'ambiguous' if candidates else 'not_found'
        return next(iter(candidates.values())), 'matched'

    def publisher_response(self, url: str):
        # Validate every redirect; external metadata must never direct requests to arbitrary hosts.
        for _ in range(5):
            if not safe_publisher_url(url):
                return None
            response = self.session.get(url, timeout=15, stream=True, allow_redirects=False)
            if response.is_redirect:
                target = urljoin(url, response.headers.get('Location', ''))
                response.close()
                url = target
                continue
            if response.status_code != 200:
                response.close()
                return None
            return response
        return None

    def public_resource(self, work: dict, kind: str) -> str | None:
        candidates = []
        for link in work.get('link', []):
            content_type = link.get('content-type', '')
            if kind == 'pdf' and content_type == 'application/pdf' and link.get('content-version') == 'vor':
                candidates.append(str(link.get('URL', '')))
            elif kind == 'video' and content_type.startswith('video/'):
                candidates.append(str(link.get('URL', '')))
        landing = str(work.get('resource', {}).get('primary', {}).get('URL', ''))
        if kind == 'pdf' and safe_publisher_url(landing):
            response = self.publisher_response(landing)
            if response is not None:
                try:
                    chunk = bytearray()
                    for block in response.iter_content(8192):
                        chunk.extend(block)
                        if len(chunk) >= 512_000:
                            break
                    soup = BeautifulSoup(bytes(chunk), 'html.parser')
                    declared_doi = soup.find('meta', attrs={'name': re.compile(r'^citation_doi$', re.I)})
                    pdf = soup.find('meta', attrs={'name': re.compile(r'^citation_pdf_url$', re.I)})
                    if (declared_doi and pdf and doi_from(declared_doi.get('content', '')) == doi_from(work['DOI'])):
                        candidates.insert(0, urljoin(landing, pdf.get('content', '')))
                finally:
                    response.close()
        for candidate in dict.fromkeys(candidates):
            response = self.publisher_response(candidate)
            if response is None:
                continue
            try:
                first = next(response.iter_content(1024), b'')
                mime = response.headers.get('Content-Type', '').split(';', 1)[0].lower()
                if kind == 'pdf' and first.lstrip().startswith(b'%PDF-') and mime == 'application/pdf':
                    return response.url
                if kind == 'video' and mime == 'video/mp4' and first[4:8] == b'ftyp':
                    return response.url
            finally:
                response.close()
        return None


def work_info(work: dict, old: dict) -> dict:
    result = dict(old)
    result['doi'] = doi_from(work['DOI'])
    if (old.get('volume') and (old.get('pages') or old.get('article_number')) and
            not (work.get('volume') and (work.get('page') or work.get('article-number')))):
        return result
    for key, remote in [('volume', 'volume'), ('issue', 'issue'), ('pages', 'page'), ('article_number', 'article-number')]:
        value = clean(work.get(remote))
        if value:
            result[key] = value.replace('–', '-').replace('—', '-')
    if work.get('article-number') and not work.get('page'):
        result.pop('pages', None)
    for field in ('published-print', 'published-online', 'published'):
        parts = work.get(field, {}).get('date-parts', [[]])[0]
        if parts and isinstance(parts[0], int) and 1900 <= parts[0] <= 2100:
            result['year'] = str(parts[0])
            month = parts[1] if len(parts) > 1 else None
            if isinstance(month, int) and 1 <= month <= 12:
                result['month'] = month
            elif old.get('year') != result['year']:
                result['month'] = None
            break
    return result


def format_tail(info: dict, pending: bool, notes: list[str]) -> str:
    pieces = [info['publisher']] if info.get('publisher') else []
    for key, label in [('volume', 'vol.'), ('issue', 'no.')]:
        if info.get(key):
            pieces.append(f'{label} {info[key]}')
    if info.get('article_number'):
        pieces.append('art. ' + info['article_number'])
    elif info.get('pages'):
        pieces.append('pp. ' + info['pages'].replace('-', '–'))
    date = (MONTHS[info['month']] + ' ') if info.get('month') else ''
    pieces.append(date + info['year'])
    if pending:
        pieces.append('Early Access')
    return ', '.join(pieces) + '. doi: ' + info['doi'] + '.' + (' ' + ' '.join(notes) if notes else '')


def build_bibtex(entry: dict, work: dict, info: dict) -> str:
    def brace(value):
        return clean(value).replace('\\', '').replace('{', '').replace('}', '')
    fields = {'author': ' and '.join(f"{brace(a.get('family'))}, {brace(a.get('given'))}" for a in work['author']),
              'title': clean(work['title'][0]),
              'booktitle' if entry['type'] == 'conference' else 'journal': clean(work['container-title'][0])}
    for target, key in [('year', 'year'), ('volume', 'volume'), ('number', 'issue'), ('doi', 'doi')]:
        if info.get(key):
            fields[target] = info[key]
    if info.get('article_number'):
        fields['pages'] = info['article_number']
    elif info.get('pages'):
        fields['pages'] = info['pages'].replace('-', '--')
    if info.get('month'):
        fields['month'] = MONTHS[info['month']]
    if info.get('publisher'):
        fields['organization'] = info['publisher']
    entry_type = 'inproceedings' if entry['type'] == 'conference' else 'article'
    key = 'pub' + hashlib.sha256(info['doi'].encode()).hexdigest()[:12]
    return '@' + entry_type + '{' + key + ',\n' + ',\n'.join(f'  {k}={{{brace(v)}}}' for k, v in fields.items()) + '\n}'


def apply_work(entry: dict, record: dict, work: dict, client: Client, root: Path) -> list[dict]:
    info = work_info(work, record['info'])
    doi_url = 'https://doi.org/' + info['doi']
    repairs = []
    if not any('pdf' in a.find('img').get('alt', '').lower() or a.get('data-resource-kind') == 'pdf'
               for a in record['resources']):
        resource = record['soup'].new_tag('a', href=doi_url)
        resource['data-resource-kind'] = 'pdf'
        resource['data-needs-public-pdf'] = 'true'
        resource.append(record['soup'].new_tag('img', alt='Publisher badge'))
        record['resources'].append(resource)
    for resource in record['resources']:
        missing = resource.get('data-missing-local-file') or resource.get('href', '')
        path = local_resource(root, missing)
        needs_pdf = resource.has_attr('data-needs-public-pdf')
        if not needs_pdf and (not path or path.is_file()):
            continue
        kind = 'pdf' if needs_pdf or path.suffix.lower() == '.pdf' else 'video' if path.suffix.lower() == '.mp4' else ''
        if not kind:
            continue
        try:
            public = client.public_resource(work, kind)
        except (requests.RequestException, ValueError) as exc:
            public = None
            repairs.append({'missing': missing, 'probe_error': type(exc).__name__})
        if path:
            resource['data-missing-local-file'] = missing
        resource['data-resource-kind'] = kind
        if public:
            resource['href'] = public
            resource['data-verified-resource'] = kind
            resource.attrs.pop('data-needs-public-pdf', None)
            badge = resource.find('img')
            if kind == 'pdf':
                badge['alt'] = 'PDF badge'
                badge['src'] = 'https://img.shields.io/badge/Link-PDF-gree'
            repairs.append({'missing': missing, 'replacement': public, 'kind': kind})
        elif kind == 'pdf':
            if resource.get('data-verified-resource') == 'pdf' and safe_publisher_url(resource.get('href', '')):
                repairs.append({'missing': missing, 'replacement': resource['href'], 'kind': 'retained_verified_pdf'})
                continue
            resource['href'] = doi_url
            resource['data-needs-public-pdf'] = 'true'
            badge = resource.find('img')
            badge['alt'] = 'Publisher badge'
            badge['src'] = 'https://img.shields.io/badge/Link-Publisher-0969da?labelColor=555'
            repairs.append({'missing': missing, 'replacement': doi_url, 'kind': 'publisher_page_only'})
    title = clean(work['title'][0])
    prefix = record['paragraph'].decode_contents().split('“', 1)[0]
    pending = record['pending'] and not (info.get('volume') and (info.get('pages') or info.get('article_number')))
    notes = [note for note in record['notes'] if not re.search(r'early access|accepted|in press|to appear', note, re.I)]
    tail = format_tail(info, pending, notes)
    venue_label = record['venue'].find('a') or record['venue']
    venue_label.clear()
    venue_label.append(clean(work['container-title'][0]))
    venue = str(record['venue'])
    conference = 'in ' if entry['type'] == 'conference' else ''
    resources = ' '.join(str(a) for a in record['resources'])
    entry['body_html'] = ('<p>' + prefix + '“<a href="' + html.escape(doi_url, quote=True) + '">' + html.escape(title) +
                          '</a>,” ' + conference + venue + ', ' + html.escape(tail) + (' ' + resources if resources else '') + '</p>')
    entry['year'] = info['year']
    entry['date'] = info['year'] + (f"-{info['month']:02d}" if info.get('month') else '')
    entry['metadata'] = {**info, 'title': title, 'venue': clean(work['container-title'][0]),
                         'source': 'https://api.crossref.org/works/' + quote(info['doi'], safe='')}
    entry['citation_plain'] = (record['author_text'] + ', “' + title + ',” ' + conference + record['venue'].get_text() + ', ' + tail)
    entry['citation_bibtex'] = build_bibtex(entry, work, info)
    return repairs


def refresh(entries: list[dict], root: Path, client: Client, checked_at: str) -> tuple[list[dict], dict]:
    updated = copy.deepcopy(entries)
    checks = []
    for index, entry in enumerate(updated, 1):
        try:
            record = parse_record(entry)
            before = issues_for(entry, record, root)
            if not before:
                continue
            check = {'entry': index, 'title': record['title'], 'issues_before': before}
            checks.append(check)
            work, status = client.lookup(entry, record)
            check['result'] = status
            if work:
                check['source'] = 'https://api.crossref.org/works/' + quote(work['DOI'], safe='')
                check['resource_repairs'] = apply_work(entry, record, work, client, root)
                check['result'] = 'updated' if entry != entries[index - 1] else 'unchanged'
            check['issues_after'] = issues_for(entry, parse_record(entry), root)
        except (requests.RequestException, ValueError, KeyError, TypeError, IndexError) as exc:
            # A failed external lookup must never partially rewrite a record.
            updated[index - 1] = copy.deepcopy(entries[index - 1])
            if not checks or checks[-1].get('entry') != index:
                checks.append({'entry': index})
            checks[-1].update(result='error', error=type(exc).__name__ + ': ' + str(exc)[:250])
        print(f'[{index}/{len(entries)}] ' + (checks[-1]['result'] if checks and checks[-1]['entry'] == index else 'complete'), flush=True)
    report = {'checked_at': checked_at, 'provider': 'Crossref (publisher-deposited metadata)',
              'summary': {'total': len(entries), 'checked': len(checks),
                          'updated': sum(a != b for a, b in zip(entries, updated)),
                          'errors': sum(c['result'] == 'error' for c in checks),
                          'pending': sum(bool(c.get('issues_after', c.get('issues_before', []))) for c in checks)},
              'entries': checks}
    return updated, report


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--write', action='store_true', help='Apply verified updates; default is a dry run')
    parser.add_argument('--report', type=Path, help='Optional report path, also available in dry runs')
    args = parser.parse_args(argv)
    root = args.root.resolve()
    entries = json.loads((root / DATA).read_text(encoding='utf-8'))
    updated, report = refresh(entries, root, Client(), datetime.now(timezone.utc).isoformat(timespec='seconds'))
    failed = report['summary']['checked'] > 0 and report['summary']['errors'] == report['summary']['checked']
    if args.write and not failed:
        if updated != entries:
            write_json(root / DATA, updated)
        write_json(root / REPORT, report)
    if args.report:
        write_json(args.report, report)
    print(json.dumps(report['summary'], ensure_ascii=False))
    if failed:
        print('All checks failed; publication data was not changed.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
