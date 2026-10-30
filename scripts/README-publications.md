# 论文条目自动核查

页面及引用弹窗以 `_data/publications.json` 为唯一数据源。`Update publication records` 工作流每月 1 日香港时间 09:23 检查一次，也可以在 GitHub Actions 中选择 **Run workflow** 手动运行；勾选 `dry_run` 可只生成报告。

## 检查范围与更新规则

- 检查缺 DOI、卷号、页码/文章号、尚未正式编卷、年份不一致、缺本地 PDF/视频、没有 PDF 入口的条目。已经完整且资源存在的条目不重复查询。
- 使用出版社提交给 [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) 的正式期刊/会议记录。已知 DOI 精确查询，其余按标题搜索；必须同时通过标题相似度、作者、刊物和文献类型核对，且只有一个匹配结果才更新。不会把预印本或相近标题的另一篇论文写入。
- 同步卷、期、页码/文章号、发表年/月、正式标题、DOI 和对应的 Plain Text/BibTeX；保留作者加粗、Google Scholar ID、已有本地文件、资源按钮和条目顺序。正式卷期优先于 Early Access，不用缺字段覆盖已有信息。
- 对缺失 PDF 优先查出版社登记的正式版本链接及官方页面的 `citation_pdf_url`。只访问脚本中列明的 HTTPS 出版社域名，逐跳检查重定向；成功响应必须同时具有 PDF 文件头和 PDF MIME 类型，才显示 PDF 按钮。没有直接公开 PDF 时显示 **Publisher**，指向同一 DOI 的正式出版入口；该入口可能需要订阅。
- 缺失视频只使用与同一论文关联且通过内容类型/MP4 文件头验证的公开视频，不用论文或其他视频顶替。没有找到的资源保留待查状态，每月继续检查。出版社短暂不可访问时，保留此前已经验证的资源链接。
- 不下载或重新托管论文、视频；不绕过付费墙、验证码或访问限制。Crossref 未收录、匹配不唯一或查询失败时保留原条目，报告原因。中文/非 Crossref 登记文献可人工从正式期刊记录核实 DOI，来源保存在条目 `metadata.source` 中。

## 报告与发布

`_data/publication_checks.json` 保存最近一次检查时间、来源、更新数量、资源替代情况和剩余问题。每次工作流还保留 90 天的 `publication-checks` artifact，并输出 Actions 摘要。检查记录会提交到仓库，即使没有文献变化，也能查看最后一次正常检查的时间；历史记录可从 Git 历史查看。报告与脚本不显示在论文页上。

非预览运行仅提交 `_data/publications.json` 和 `_data/publication_checks.json`。提交后通过 [GitHub Pages Build API](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build) 请求发布，因为使用工作流 `GITHUB_TOKEN` 的推送[不会自动触发分支式 Pages 构建](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。重跑也会重新请求构建，以便恢复偶发发布失败。

工作流使用已有仓库的 `contents: write`、`pages: write` 权限，无需新增个人 token。与人工修改冲突时停止，不强制推送。备份与 `assets/papers/归档.zip` 不在暂存清单内，并继续由 `.gitignore` 和 Jekyll 排除。

## 本地运行

```sh
python -m venv /tmp/publication-update-venv
/tmp/publication-update-venv/bin/pip install -r scripts/requirements-publications.txt
/tmp/publication-update-venv/bin/python -m unittest discover -s scripts/tests -v
# 默认只检查，不修改数据
/tmp/publication-update-venv/bin/python scripts/update_publications.py --report /tmp/publication-checks.json
# 应用已验证的信息并更新检查记录
/tmp/publication-update-venv/bin/python scripts/update_publications.py --write
```

`scripts/update_ieee_metadata.py` 保留为兼容入口，也改为默认预览。首次核查前的本地备份为 `docs/backups/publications-before-2026-10-30.tar.gz`。

如需改为每周，将现有工作流的唯一 `schedule` 改为 `23 1 * * 1`（周一香港时间 09:23）。不要额外启用另一份重复的定时任务。GitHub 的计划任务可能延迟，运行时间以 Actions 记录为准。
