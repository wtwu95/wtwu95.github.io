import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

import requests
from scripts import update_publications as up

TITLE = 'Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance'
DOI = '10.1109/jas.2024.000001'


def entry(tail=', 2024.', resource=''):
    return {'type': 'journal', 'year': '2024', 'date': '2024-01', 'scholar_id': 'unchanged-id',
            'body_html': '<p><strong>W. Wu</strong>, D. Wu, and Y. Zhang, “<a href="https://example.org">' + TITLE + '</a>,” '
                         '<em class="publication-venue"><a href="https://example.org/journal">IEEE/CAA Journal of Automatica Sinica</a></em>' + tail + ' ' + resource + '</p>'}


def work():
    return {'DOI': DOI, 'type': 'journal-article', 'title': [TITLE],
            'container-title': ['IEEE/CAA Journal of Automatica Sinica'],
            'author': [{'given': 'Wentao', 'family': 'Wu'}, {'given': 'Di', 'family': 'Wu'},
                       {'given': 'Yibo', 'family': 'Zhang'}],
            'volume': '12', 'issue': '2', 'page': '2033-2035',
            'published-print': {'date-parts': [[2025, 2]]}}


def client_for(message=None):
    client = Mock()
    client.lookup.return_value = (message or work(), 'matched')
    client.public_resource.return_value = None
    return client


class RecordTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)

    def test_complete_record_does_not_request_metadata(self):
        data = entry(', vol. 12, no. 2, pp. 2033–2035, Feb. 2025. doi: ' + DOI + '.', resource='<a href="https://ieeexplore.ieee.org/file.pdf"><img alt="PDF badge" src="badge.svg"></a>')
        data.update(year='2025', date='2025-02')
        client = client_for()
        result, report = up.refresh([data], self.root, client, 'now')
        self.assertEqual(result, [data])
        self.assertEqual(report['summary']['checked'], 0)
        client.lookup.assert_not_called()

    def test_refresh_updates_real_data_and_citations_preserving_authors_and_resources(self):
        data = entry(resource='<a href="/assets/papers/test.pdf"><img alt="PDF badge" src="badge.svg"></a>')
        file = self.root / 'assets/papers/test.pdf'
        file.parent.mkdir(parents=True)
        file.write_bytes(b'%PDF-original')
        result, report = up.refresh([data], self.root, client_for(), 'now')
        item = result[0]
        self.assertEqual(item['year'], '2025')
        self.assertEqual(item['date'], '2025-02')
        self.assertEqual(item['scholar_id'], 'unchanged-id')
        self.assertIn('<strong>W. Wu</strong>', item['body_html'])
        self.assertIn('href="/assets/papers/test.pdf"', item['body_html'])
        self.assertIn('vol. 12, no. 2, pp. 2033–2035, Feb. 2025.', item['body_html'])
        self.assertIn('year={2025}', item['citation_bibtex'])
        self.assertIn('doi={' + DOI + '}', item['citation_bibtex'])
        self.assertEqual(report['entries'][0]['issues_after'], [])
        self.assertEqual(up.refresh(result, self.root, client_for(), 'later')[0], result)
        self.assertEqual(file.read_bytes(), b'%PDF-original')

    def test_author_title_venue_type_and_doi_must_match(self):
        record = up.parse_record(entry())
        self.assertTrue(up.matches(record, work(), 'journal'))
        for field, value in [('title', ['An unrelated robotic experiment']), ('type', 'posted-content'),
                             ('author', [{'family': 'Someone', 'given': 'Else'}]),
                             ('container-title', ['An Unrelated Journal'])]:
            candidate = work()
            candidate[field] = value
            self.assertFalse(up.matches(record, candidate, 'journal'), field)
        record['info']['doi'] = '10.1109/other'
        self.assertFalse(up.matches(record, work(), 'journal'))

    def test_ambiguous_results_are_not_applied(self):
        client = up.Client(delay=0)
        another = work()
        another['DOI'] = '10.1109/another'
        client.metadata = Mock(return_value={'items': [work(), another]})
        self.assertEqual(client.lookup(entry(), up.parse_record(entry())), (None, 'ambiguous'))

    def test_unmatched_and_network_errors_preserve_record(self):
        data = entry()
        for result in [(None, 'not_found'), (None, 'ambiguous')]:
            client = client_for()
            client.lookup.return_value = result
            self.assertEqual(up.refresh([data], self.root, client, 'now')[0], [data])
        client.lookup.side_effect = requests.Timeout('network')
        result, report = up.refresh([data], self.root, client, 'now')
        self.assertEqual(result, [data])
        self.assertEqual(report['summary']['errors'], 1)

    def test_missing_pdf_uses_correctly_labelled_publisher_link_and_remains_monitored(self):
        data = entry(resource='<a href="/assets/papers/missing.pdf"><img alt="PDF badge" src="badge.svg"></a>')
        client = client_for()
        result, report = up.refresh([data], self.root, client, 'now')
        self.assertIn('Publisher badge', result[0]['body_html'])
        self.assertIn('href="https://doi.org/' + DOI + '"', result[0]['body_html'])
        self.assertIn('data-missing-local-file="/assets/papers/missing.pdf"', result[0]['body_html'])
        self.assertIn('missing_file:/assets/papers/missing.pdf', report['entries'][0]['issues_after'])
        self.assertEqual(up.refresh(result, self.root, client, 'later')[0], result)

    def test_pdf_probe_failure_does_not_discard_verified_metadata(self):
        data = entry(resource='<a href="/assets/papers/missing.pdf"><img alt="PDF badge" src="badge.svg"></a>')
        client = client_for()
        client.public_resource.side_effect = requests.Timeout('publisher unavailable')
        result, report = up.refresh([data], self.root, client, 'now')
        self.assertEqual(result[0]['year'], '2025')
        self.assertIn('Publisher badge', result[0]['body_html'])
        self.assertEqual(report['summary']['errors'], 0)

    def test_missing_video_is_never_replaced_by_paper_pdf(self):
        data = entry(resource='<a href="/assets/Video/missing.mp4"><img alt="Video badge" src="badge.svg"></a>')
        result, report = up.refresh([data], self.root, client_for(), 'now')
        self.assertIn('href="/assets/Video/missing.mp4"', result[0]['body_html'])
        self.assertIn('Video badge', result[0]['body_html'])
        self.assertIn('missing_file:/assets/Video/missing.mp4', report['entries'][0]['issues_after'])

    def test_final_metadata_does_not_erase_existing_fields_when_registry_is_sparse(self):
        old = {'volume': '11', 'issue': '9', 'pages': '1-9', 'year': '2024', 'month': 9}
        sparse = work()
        for key in ['volume', 'issue', 'page', 'published-print']:
            sparse.pop(key)
        info = up.work_info(sparse, old)
        self.assertEqual({key: info[key] for key in old}, old)
        sparse['volume'] = '12'
        sparse['article-number'] = '112983'
        self.assertNotIn('pages', up.work_info(sparse, old))

    def test_remote_html_cannot_inject_markup(self):
        message = work()
        message['title'] = [TITLE + '<script>alert(1)</script>']
        result, _ = up.refresh([entry()], self.root, client_for(message), 'now')
        self.assertNotIn('<script>', result[0]['body_html'])
        self.assertNotIn('<script>', result[0]['citation_bibtex'])

    def test_missing_pdf_badge_gets_a_verified_resource(self):
        client = client_for()
        client.public_resource.return_value = 'https://ieeexplore.ieee.org/file.pdf'
        result, _ = up.refresh([entry()], self.root, client, 'now')
        self.assertIn('PDF badge', result[0]['body_html'])
        self.assertIn('https://ieeexplore.ieee.org/file.pdf', result[0]['body_html'])
        self.assertNotIn('missing_pdf_resource', up.issues_for(result[0], up.parse_record(result[0]), self.root))
        client.public_resource.assert_called_once_with(work(), 'pdf')

    def test_verified_pdf_survives_later_probe_failure(self):
        data = entry(resource='<a href="/assets/papers/missing.pdf"><img alt="PDF badge" src="badge.svg"></a>')
        client = client_for()
        client.public_resource.return_value = 'https://ieeexplore.ieee.org/file.pdf'
        result, _ = up.refresh([data], self.root, client, 'now')
        client.public_resource.side_effect = requests.Timeout('temporary outage')
        later, _ = up.refresh(result, self.root, client, 'later')
        self.assertEqual(later, result)
        self.assertIn('PDF badge', later[0]['body_html'])

    def test_conference_publisher_is_preserved(self):
        data = entry(', IEEE, pp. 200–210, 2024.')
        data['type'] = 'conference'
        message = work()
        message['type'] = 'proceedings-article'
        result, _ = up.refresh([data], self.root, client_for(message), 'now')
        self.assertIn('IEEE, vol.', result[0]['body_html'])
        self.assertIn('organization={IEEE}', result[0]['citation_bibtex'])

    def test_early_access_does_not_replace_a_final_issue_with_provisional_pages(self):
        old = {'volume': '12', 'issue': '2', 'pages': '2033-2035', 'year': '2025', 'month': 2}
        message = work()
        message.pop('volume')
        message.pop('published-print')
        message['page'] = '1-3'
        message['published-online'] = {'date-parts': [[2024, 10]]}
        result = up.work_info(message, old)
        self.assertEqual({key: result[key] for key in old}, old)

    def test_report_writes_atomically_and_preserves_unicode(self):
        path = self.root / 'report.json'
        up.write_json(path, {'note': '核查'})
        self.assertEqual(json.loads(path.read_text()), {'note': '核查'})
        self.assertFalse(path.with_suffix('.json.tmp').exists())


class CommandTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.data = self.root / up.DATA
        self.data.parent.mkdir(parents=True)
        self.original = json.dumps([entry()], ensure_ascii=False)
        self.data.write_text(self.original)

    def test_default_is_read_only(self):
        report = self.root / 'preview.json'
        with patch.object(up, 'Client', return_value=client_for()):
            self.assertEqual(up.main(['--root', str(self.root), '--report', str(report)]), 0)
        self.assertEqual(self.data.read_text(), self.original)
        self.assertFalse((self.root / up.REPORT).exists())
        self.assertEqual(json.loads(report.read_text())['summary']['updated'], 1)

    def test_write_updates_canonical_json_and_audit(self):
        with patch.object(up, 'Client', return_value=client_for()):
            self.assertEqual(up.main(['--root', str(self.root), '--write']), 0)
        self.assertEqual(json.loads(self.data.read_text())[0]['year'], '2025')
        self.assertTrue((self.root / up.REPORT).exists())

    def test_total_failure_exits_nonzero_without_changing_data(self):
        client = client_for()
        client.lookup.side_effect = requests.Timeout('service down')
        report = self.root / 'failure.json'
        with patch.object(up, 'Client', return_value=client):
            self.assertEqual(up.main(['--root', str(self.root), '--write', '--report', str(report)]), 1)
        self.assertEqual(self.data.read_text(), self.original)
        self.assertFalse((self.root / up.REPORT).exists())
        self.assertEqual(json.loads(report.read_text())['summary']['errors'], 1)


class ResourceSafetyTests(unittest.TestCase):
    def test_reject_arbitrary_or_credentialled_publisher_urls(self):
        for url in ['http://127.0.0.1/private', 'https://evil.test/file.pdf',
                    'https://ieeexplore.ieee.org.evil.test/file.pdf',
                    'https://user:password@ieeexplore.ieee.org/file.pdf',
                    'https://ieeexplore.ieee.org:8443/file.pdf',
                    'https://ieeexplore.ieee.org/file.pdf?token=secret']:
            self.assertFalse(up.safe_publisher_url(url), url)
        self.assertTrue(up.safe_publisher_url('https://ieeexplore.ieee.org/document/123'))

    def test_redirects_to_private_hosts_are_not_followed(self):
        client = up.Client(delay=0)
        response = Mock(is_redirect=True, headers={'Location': 'http://127.0.0.1/private'})
        client.session.get = Mock(return_value=response)
        self.assertIsNone(client.publisher_response('https://ieeexplore.ieee.org/document/123'))
        self.assertEqual(client.session.get.call_count, 1)
        response.close.assert_called_once()

    def test_html_paywall_is_not_a_pdf(self):
        message = work()
        message['link'] = [{'URL': 'https://ieeexplore.ieee.org/file.pdf',
                            'content-type': 'application/pdf', 'content-version': 'vor'}]
        for mime, content, expected in [('text/html', b'<html>Login</html>', None),
                                        ('application/pdf', b'%PDF-1.7\n', 'https://ieeexplore.ieee.org/file.pdf')]:
            client = up.Client(delay=0)
            response = Mock(headers={'Content-Type': mime}, url='https://ieeexplore.ieee.org/file.pdf')
            response.iter_content.return_value = iter([content])
            client.publisher_response = Mock(return_value=response)
            self.assertEqual(client.public_resource(message, 'pdf'), expected)


if __name__ == '__main__':
    unittest.main()
