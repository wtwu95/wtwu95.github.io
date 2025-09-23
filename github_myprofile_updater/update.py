import json


def load_markdown(path):
    with open(path, encoding='utf-8') as handle:
        return handle.read().strip()


def build_news_section(data_path):
    with open(data_path, encoding='utf-8') as handle:
        news_items = json.load(handle)

    lines = ['# 💬 News', '']

    for item in news_items:
        lines.append(f"- *{item['date']}* &nbsp;{item['content']}")

    return '\n'.join(lines)


if __name__ == '__main__':
    _header = '## Hi there 👋'
    base_dir = '../_pages/includes/'
    data_dir = '../_data/'
    _intro = load_markdown(f'{base_dir}/intro.md')
    _homepage = load_markdown(f'{base_dir}/homepage.md')
    _pub = load_markdown(f'{base_dir}/pub.md')
    _news = build_news_section(f'{data_dir}/news.json')
    with open('README.md', 'w') as f:
        f.write(_header)
        f.write('\n\n')
        f.write(_intro)
        f.write('\n\n##')
        f.write(_homepage)
        f.write('\n\n##')
        f.write(_news)
        f.write('\n\n##')
        f.write(_pub)
