import html
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

AUTHOR_DETAILS = {
    "Wentao Wu": ("W. Wu", "Wentao Wu"),
    "Yibo Zhang": ("Y. Zhang", "Yibo Zhang"),
    "Weidong Zhang": ("W. Zhang", "Weidong Zhang"),
    "Ruihang Ji": ("R. Ji", "Ruihang Ji"),
    "Hongtian Chen": ("H. Chen", "Hongtian Chen"),
    "Zhenhua Li": ("Z. Li", "Zhenhua Li"),
    "Hak-Keung Lam": ("H.-K. Lam", "Hak-Keung Lam"),
    "Jun-Guo Lu": ("J.-G. Lu", "Jun-Guo Lu"),
    "Zehua Jia": ("Z. Jia", "Zehua Jia"),
    "Di Wu": ("D. Wu", "Di Wu"),
    "Edmond Q. Wu": ("E. Q. Wu", "Edmond Q. Wu"),
    "Peng Cheng": ("P. Cheng", "Peng Cheng"),
    "Shukang Chen": ("S. Chen", "Shukang Chen"),
    "Tao Xie": ("T. Xie", "Tao Xie"),
    "Haoliang Wang": ("H. Wang", "Haoliang Wang"),
    "Haibo Lu": ("H. Lu", "Haibo Lu"),
    "Lu Liu": ("L. Liu", "Lu Liu"),
    "Min Li": ("M. Li", "Min Li"),
    "Mingao Lv": ("M. Lv", "Mingao Lv"),
    "Jinhui Lu": ("J. Lu", "Jinhui Lu"),
    "Jizhou Jiang": ("J. Jiang", "Jizhou Jiang"),
    "Chenming Zhang": ("C. Zhang", "Chenming Zhang"),
    "Weixing Chen": ("W. Chen", "Weixing Chen"),
    "Qing-Long Han": ("Q.-L. Han", "Qing-Long Han"),
    "Dan Wang": ("D. Wang", "Dan Wang"),
    "Wei Xie": ("W. Xie", "Wei Xie"),
    "Nan Gu": ("N. Gu", "Nan Gu"),
    "Yuanhui Wang": ("Y. Wang", "Yuanhui Wang"),
    "Lin Bai": ("L. Bai", "Lin Bai"),
    "Xiangxuan Ren": ("X. Ren", "Xiangxuan Ren"),
    "Zhi Liu": ("Z. Liu", "Zhi Liu"),
    # Chinese names
    "吴文涛": ("W. Wu", "Wentao Wu"),
    "彭周华": ("Z. Peng", "Zhouhua Peng"),
    "王丹": ("D. Wang", "Dan Wang"),
    "刘陆": ("L. Liu", "Lu Liu"),
    "姜继洲": ("J. Jiang", "Jizhou Jiang"),
    "任帅": ("S. Ren", "Shuai Ren"),
    "古楠": ("N. Gu", "Nan Gu"),
}

AUTHOR_OVERRIDES = {}
for name, (short, full) in AUTHOR_DETAILS.items():
    AUTHOR_OVERRIDES[name] = {"short": short, "full": full}
    AUTHOR_OVERRIDES[short] = {"short": short, "full": full}

VENUE_NAME_MAP = {
    "IEEE Trans. Veh. Tech.": "IEEE Transactions on Vehicular Technology",
    "IEEE Trans. Fuzzy Syst.": "IEEE Transactions on Fuzzy Systems",
    "IEEE Trans. Circuits Syst. II Express Briefs": "IEEE Transactions on Circuits and Systems II: Express Briefs",
    "IEEE Trans. Cybern.": "IEEE Transactions on Cybernetics",
    "IEEE Trans. Syst. Man, Cybern., Syst.": "IEEE Transactions on Systems, Man, and Cybernetics: Systems",
    "IEEE Trans. Intell. Veh.": "IEEE Transactions on Intelligent Vehicles",
    "IEEE Trans. Intell. Transp. Syst.": "IEEE Transactions on Intelligent Transportation Systems",
    "IEEE/CAA J. Autom. Sinica": "IEEE/CAA Journal of Automatica Sinica",
    "Ocean. Eng.": "Ocean Engineering",
}

MONTH_ALIASES = {
    "Jan.": "Jan.",
    "Feb.": "Feb.",
    "Mar.": "Mar.",
    "Apr.": "Apr.",
    "May": "May",
    "Jun.": "Jun.",
    "Jul.": "Jul.",
    "Aug.": "Aug.",
    "Sept.": "Sept.",
    "Sep.": "Sept.",
    "Oct.": "Oct.",
    "Nov.": "Nov.",
    "Dec.": "Dec.",
}


def venue_class(entry_type: str, venue_name: str):
    name = (venue_name or "").strip()
    base_class = "publication-venue"
    if entry_type == "conference":
        return f"{base_class} publication-venue--conference"
    if re.search(r"[\u4e00-\u9fff]", name):
        return f"{base_class} publication-venue--chinese-journal"
    if "IEEE" in name.upper():
        return f"{base_class} publication-venue--ieee-journal"
    return f"{base_class} publication-venue--english-journal"


def load_entries(path: Path):
    html = path.read_text()
    soup = BeautifulSoup(html, "html.parser")
    entries = []
    for li in soup.select('#publication-source li'):
        entry = {
            "type": li.get("data-type"),
            "year": li.get("data-year"),
            "date": li.get("data-date"),
            "citation_id": None,
        }
        span = li.find("span", class_="show_paper_citations")
        if span and span.get("data"):
            entry["citation_id"] = span.get("data")

        p = li.find("p")
        if not p:
            continue

        raw_html = p.decode_contents()
        title_match = re.search(r"“([^”]+)”", raw_html)
        if title_match:
            title_fragment = title_match.group(1)
            title_text = BeautifulSoup(title_fragment, "html.parser").get_text(strip=True)
            entry["title"] = title_text.rstrip('.,')
        else:
            entry["title"] = ""

        title_link = p.find("a")
        if title_link:
            entry["title_url"] = title_link.get("href")
        else:
            entry["title_url"] = ""

        venue_el = p.find("em")
        entry["venue_name"] = ""
        entry["venue_url"] = ""
        if venue_el:
            a = venue_el.find("a")
            if a:
                entry["venue_name"] = a.text.strip()
                entry["venue_url"] = a.get("href")
            else:
                entry["venue_name"] = venue_el.text.strip()

        author_buffer = ""
        author_nodes = []
        for node in p.contents:
            if getattr(node, "name", None) == "a" and node.get("href"):
                break
            if getattr(node, "name", None) == "strong":
                author_nodes.append({"text": node.get_text(), "highlight": True})
                author_buffer += node.get_text()
            elif isinstance(node, str):
                author_buffer += node
            else:
                if node.name == "a":
                    break
        if "“" in author_buffer:
            author_buffer = author_buffer.split("“", 1)[0]
        author_buffer = author_buffer.replace("，", ",").replace("、", ",")
        author_buffer = author_buffer.replace(" and ", ", ")
        author_buffer = author_buffer.replace(";", ",")
        authors = []
        for part in [seg.strip() for seg in author_buffer.split(",") if seg.strip()]:
            part = part.strip('“”"')
            part = re.sub(r"[.\s]+$", "", part)
            if not part:
                continue
            highlight = any(node["text"] == part for node in author_nodes)
            authors.append({"name": part, "highlight": highlight})
        entry["authors"] = authors

        tail_text = ""
        collect = False
        for node in p.contents:
            if node == venue_el:
                collect = True
                continue
            if collect:
                if getattr(node, "name", None) == "a" and node.find("img"):
                    continue
                if isinstance(node, str):
                    tail_text += node
        tail_text = re.sub(r"\s+", " ", tail_text).strip()
        tail_text = re.sub(r"\[[^\]]*\]", "", tail_text).strip()
        entry["tail"] = tail_text

        resources = []
        for a in p.find_all("a"):
            if a.find("img"):
                resources.append(str(a))
        entry["resources"] = resources
        entries.append(entry)
    return entries


def to_short_name(full_name: str) -> tuple[str, str]:
    if full_name in AUTHOR_OVERRIDES:
        override = AUTHOR_OVERRIDES[full_name]
        return override["short"], override["full"]

    clean = full_name.replace("*", "").strip()
    if re.search(r"[\u4e00-\u9fff]", clean):
        # Unknown Chinese name, return as-is without conversion
        return clean, clean

    parts = clean.split()
    if len(parts) == 1:
        return clean, clean
    last = parts[-1]
    initials = []
    for token in parts[:-1]:
        token = token.strip('.-')
        if not token:
            continue
        segments = token.split('-')
        initial_parts = [seg[0].upper() + '.' for seg in segments if seg]
        initials.append('-'.join(initial_parts))
    short = ' '.join(initials + [last])
    full = clean
    return short, full


def parse_tail(tail: str) -> dict:
    data = {
        "volume": None,
        "number": None,
        "pages": None,
        "article": None,
        "publisher": None,
        "month": None,
        "year": None,
        "note": None,
        "doi": None,
        "extra": [],
    }
    tail = tail.strip()
    if tail.startswith(','):
        tail = tail[1:].strip()
    tail = tail.rstrip('.')
    if not tail:
        return data
    parts = [part.strip() for part in tail.split(',') if part.strip()]
    for part in parts:
        lower = part.lower()
        if lower.startswith('vol.'):
            data['volume'] = part[4:].strip()
        elif lower.startswith('no.'):
            data['number'] = part[3:].strip()
        elif lower.startswith('pp.'):
            pages = part[3:].strip()
            pages = pages.replace('–', '-').replace('—', '-')
            data['pages'] = pages
        elif lower.startswith('doi'):
            doi = part.split(':', 1)[1] if ':' in part else part[3:]
            data['doi'] = doi.strip()
        elif any(month in part for month in MONTH_ALIASES):
            for month, alias in MONTH_ALIASES.items():
                if month in part:
                    data['month'] = alias
                    break
            year_match = re.search(r'(19|20)\d{2}', part)
            if year_match:
                data['year'] = year_match.group(0)
        elif re.fullmatch(r'(19|20)\d{2}', part):
            data['year'] = part
        elif 'accepted' in lower:
            data['note'] = 'Accepted for publication'
        elif part.upper() == 'IEEE':
            data['publisher'] = 'IEEE'
        elif re.fullmatch(r'\d{4,}', part):
            data['article'] = part
        else:
            data['extra'].append(part)
    return data


def format_tail_from_info(info: dict) -> str:
    parts = []
    if info.get("volume"):
        parts.append(f"vol. {info['volume']}")
    if info.get("number"):
        parts.append(f"no. {info['number']}")
    if info.get("pages"):
        parts.append(f"pp. {info['pages']}")
    elif info.get("article"):
        parts.append(f"art. {info['article']}")
    if info.get("month") and info.get("year"):
        parts.append(f"{info['month']} {info['year']}")
    elif info.get("year"):
        parts.append(str(info['year']))
    if info.get("note"):
        parts.append(info["note"])
    parts.extend(info.get("extra", []))
    tail = ""
    if parts:
        tail = ", " + ", ".join(parts) + "."
    if info.get("doi"):
        if tail:
            tail += f" doi: {info['doi']}."
        else:
            tail = f", doi: {info['doi']}."
    return tail


def format_authors(authors):
    display_parts = []
    plain_parts = []
    bib_parts = []
    for author in authors:
        short, full = to_short_name(author['name'])
        display = short
        if author['highlight']:
            display = f"<strong>{display}</strong>"
        display_parts.append(display)
        plain_parts.append(short)
        # Convert to "Last, First" form for BibTeX
        tokens = full.replace('*', '').strip().split()
        if len(tokens) >= 2:
            last = tokens[-1]
            given = ' '.join(tokens[:-1])
            bib_parts.append(f"{last}, {given}")
        else:
            bib_parts.append(full)
    if len(display_parts) > 1:
        display_text = ', '.join(display_parts[:-1]) + ', and ' + display_parts[-1]
        plain_text = ', '.join(plain_parts[:-1]) + ', and ' + plain_parts[-1]
        bib_text = ' and '.join(bib_parts)
    else:
        display_text = display_parts[0]
        plain_text = plain_parts[0]
        bib_text = bib_parts[0]
    return display_text, plain_text, bib_text


def format_info(entry_type: str, info: dict) -> tuple[str, str]:
    parts = []
    if entry_type == 'conference' and info['publisher']:
        parts.append(info['publisher'])
    if info['volume']:
        parts.append(f"vol. {info['volume']}")
    if info['number']:
        parts.append(f"no. {info['number']}")
    if info['pages']:
        parts.append(f"pp. {info['pages'].replace('-', '–')}")
    if info['article'] and not info['pages']:
        parts.append(f"art. {info['article']}")
    date_part = ''
    if info['month'] and info['year']:
        date_part = f"{info['month']} {info['year']}"
    elif info['year']:
        date_part = info['year']
    if date_part:
        parts.append(date_part)
    if info['note']:
        parts.append(info['note'])
    display = ', '.join(parts)
    if display:
        display += '.'
    plain = display
    if info['doi']:
        display += f" doi: {info['doi']}."
        plain += f" doi: {info['doi']}."
    return display.strip(), plain.strip()


def build_bibtex(entry, authors_bib, info):
    entry_type = 'ARTICLE' if entry['type'] in {'journal', 'review'} else 'INPROCEEDINGS'
    year = info['year'] or entry['year']
    venue_name = VENUE_NAME_MAP.get(entry['venue_name'], entry['venue_name'])
    key_base = authors_bib.split(' and ')[0].split(',')[0]
    slug = re.sub(r'[^A-Za-z0-9]+', '', entry['title'])[:6]
    key = key_base
    if year:
        key += str(year)
    if slug:
        key += slug.capitalize()
    fields = []
    fields.append(f"  author={{{authors_bib}}}")
    fields.append(f"  title={{{entry['title']}}}")
    if entry_type == 'ARTICLE':
        fields.append(f"  journal={{{venue_name}}}")
    else:
        fields.append(f"  booktitle={{{venue_name}}}")
        if info['publisher']:
            fields.append(f"  organization={{{info['publisher']}}}")
    if info['volume']:
        fields.append(f"  volume={{{info['volume']}}}")
    if info['number']:
        fields.append(f"  number={{{info['number']}}}")
    if info['pages']:
        pages = info['pages'].replace('-', '--')
        fields.append(f"  pages={{{pages}}}")
    elif info['article'] and entry_type == 'ARTICLE':
        fields.append(f"  pages={{{info['article']}}}")
    if info['month']:
        fields.append(f"  month={{{info['month']}}}")
    if year:
        fields.append(f"  year={{{year}}}")
    if info['doi']:
        fields.append(f"  doi={{{info['doi']}}}")
    if info['note']:
        fields.append(f"  note={{{info['note']}}}")
    return f"@{entry_type}{{{key},\n" + ",\n".join(fields) + "\n}"


def render_publications(entries):
    output_lines = ["<ul id=\"publication-source\" class=\"publication-source\" hidden>"]
    for entry in entries:
        authors_display, authors_plain, authors_bib = format_authors(entry['authors'])
        venue_name = VENUE_NAME_MAP.get(entry['venue_name'], entry['venue_name'])
        info = parse_tail(entry['tail'])
        info_display, info_plain = format_info(entry['type'], info)
        title_html = entry['title']
        if entry['title_url']:
            title_html = f"<a href=\"{entry['title_url']}\">{html.escape(entry['title'])}</a>"
        else:
            title_html = html.escape(entry['title'])
        venue_classes = venue_class(entry['type'], venue_name)
        class_attr = f" class=\"{venue_classes}\"" if venue_classes else ""
        if entry['type'] == 'conference':
            if entry['venue_url']:
                venue_html = f"in <em{class_attr}><a href=\"{entry['venue_url']}\">{venue_name}</a></em>"
            else:
                venue_html = f"in <em{class_attr}>{venue_name}</em>"
        else:
            if entry['venue_url']:
                venue_html = f"<em{class_attr}><a href=\"{entry['venue_url']}\">{venue_name}</a></em>"
            else:
                venue_html = f"<em{class_attr}>{venue_name}</em>"
        info_suffix = f", {info_display}" if info_display else ''
        tail_html = ''
        if entry['resources']:
            tail_html = ' ' + ' '.join(entry['resources'])
        content = f"{authors_display}, “{title_html},” {venue_html}{info_suffix}{tail_html}"
        if entry['type'] == 'conference':
            plain_text = f"{authors_plain}, “{entry['title']},” in {venue_name}"
        else:
            plain_text = f"{authors_plain}, “{entry['title']},” {venue_name}"
        if info_plain:
            plain_text += f", {info_plain}"
        plain_text = plain_text.strip()
        if not plain_text.endswith('.'):
            plain_text += '.'
        bibtex = build_bibtex(entry, authors_bib, info)
        bibtex_attr = html.escape(bibtex).replace("\n", "&#10;")
        li_attrs = [
            f"data-type=\"{entry['type']}\"",
            f"data-year=\"{entry['year']}\"" if entry['year'] else '',
            f"data-date=\"{entry['date']}\"" if entry['date'] else '',
            f"data-citation-plain=\"{html.escape(plain_text)}\"",
            f"data-citation-bibtex=\"{bibtex_attr}\"",
        ]
        li_attrs = [attr for attr in li_attrs if attr]
        output_lines.append(f"  <li {' '.join(li_attrs)}>")
        output_lines.append(f"    <p>{content}</p>")
        if entry['citation_id']:
            output_lines.append(f"    <strong><span class='show_paper_citations' data='{entry['citation_id']}'></span></strong>")
        output_lines.append("  </li>")
    output_lines.append("</ul>")
    return '\n'.join(output_lines)


def generate():
    path = Path('_pages/includes/pub.md')
    entries = load_entries(path)
    print(render_publications(entries))


if __name__ == '__main__':
    generate()
