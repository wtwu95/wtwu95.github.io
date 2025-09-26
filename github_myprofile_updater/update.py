from pathlib import Path


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    base_dir = repo_root / '_pages' / 'includes'

    _header = '## Hi there 👋'
    _intro = (base_dir / 'intro.md').read_text().strip()
    _homepage = (base_dir / 'homepage.md').read_text().strip()
    _pub = (base_dir / 'pub.md').read_text().strip()
    _news = (base_dir / 'news.md').read_text().strip()

    readme_path = repo_root / 'README.md'
    with readme_path.open('w') as f:
        f.write(_header)
        f.write('\n\n')
        f.write(_intro)
        f.write('\n\n##')
        f.write(_homepage)
        f.write('\n\n##')
        f.write(_news)
        f.write('\n\n##')
        f.write(_pub)


if __name__ == '__main__':
    main()
