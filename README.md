## Hi there 👋

# <span data-lang="en">👨🏻‍🎓 Biography</span><span data-lang="zh" hidden>👨🏻‍🎓 个人简介</span>

<p data-lang="en">
  I am a Postdoctoral Fellow in
  <a href="https://www.polyu.edu.hk/rclae/">Research Centre for Low Altitude Economy</a>,
  <a href="https://www.polyu.edu.hk/aae/">Department of Aeronautical and Aviation Engineering</a>,
  <a href="https://www.polyu.edu.hk/">The Hong Kong Polytechnic University</a>, under the supervision of Prof.
  <a href="https://scholar.google.com/citations?user=UfIb9GkAAAAJ">Wen-Hua Chen</a>.
</p>
<p data-lang="zh" hidden>
  目前，我在<a href="https://www.polyu.edu.hk/rclae/">香港理工大学低空经济研究中心</a>、
  <a href="https://www.polyu.edu.hk/aae/">航空及民航工程学系</a>担任博士后研究员，合作导师为
  <a href="https://scholar.google.com/citations?user=UfIb9GkAAAAJ">陈文华教授</a>。
</p>

<p data-lang="en">
  I was selected for the inaugural <strong>Doctoral Special Program of Young Elite Scientist Sponsorship Program</strong> by China Association for
  Science and Technology (CAST) in 2025. I obtained <strong>National Scholarships</strong> for Graduate Students (Top 1%) in 2020, 2023, and 2024.
  My master's thesis received the <strong>Excellent Master Dissertation Award</strong> of Liaoning Province! 
  I am a Youth Editorial Board Member of the
  <a href="http://www.coscipress.com/journal/JAICS">Journal of Artificial Intelligence &amp; Control Systems</a>.
  I am also an organizer for Special Session 2 of the 2025 10th ACIRS.
</p>
<p data-lang="zh" hidden>
 我于 2025 年入选<strong>首届中国科协青年人才托举工程博士专项计划</strong>，先后获得
  <strong>大连海事大学硕士国家奖学金</strong>（2020） 和 <strong>上海交通大学博士国家奖学金</strong> （2023、2024），硕士论文荣获<strong>辽宁省优秀硕士学位论文奖</strong>。自2025年起，担任<a href="http://www.coscipress.com/journal/JAICS">《Journal of Artificial Intelligence &amp; Control Systems》</a>青年编委。此外，在 2025 年第十届 ACIRS 会议组织了  “Distributed Optimization and Control for Robot Systems” 专题。
</p>

<p data-lang="en">
  My research interests include distributed control, safety-critical control, reinforcement learning, game-based optimization, and
  their applications to autonomous vehicles and multi-agent systems. I have published 30+ papers
  <a href='https://scholar.google.com/citations?user=e2ban1wAAAAJ'>
    <img src="https://img.shields.io/endpoint?logo=Google%20Scholar&amp;url=https://raw.githubusercontent.com/wtwu95/wtwu95.github.io/google-scholar-stats/gs_data_shieldsio.json&amp;labelColor=f6f6f6&amp;color=9cf&amp;style=flat&amp;label=citations" alt="Google Scholar citations">
  </a>
  in top journals and international conferences such as Automatica, IEEE T-CYB, IEEE/CAA JAS, IEEE T-ASE, IEEE T-FS, IEEE CDC, and IROS.
</p>
<p data-lang="zh" hidden>
  我的研究兴趣包括分布式控制、安全关键控制、强化学习、博弈论及其在自主车辆和多智能体系统中的应用。目前在 Automatica、IEEE T-CYB、IEEE/CAA JAS、
  IEEE T-ITS、IEEE T-FS、IEEE CDC、IROS 等国际顶级期刊与会议发表 SCI/EI 论文 30 余篇
  <a href='https://scholar.google.com/citations?user=e2ban1wAAAAJ'>
    <img src="https://img.shields.io/endpoint?logo=Google%20Scholar&amp;url=https://raw.githubusercontent.com/wtwu95/wtwu95.github.io/google-scholar-stats/gs_data_shieldsio.json&amp;labelColor=f6f6f6&amp;color=9cf&amp;style=flat&amp;label=citations" alt="Google Scholar 引用数">
  </a>。
</p>

<p data-lang="en">
  Welcome to contact me for academic collaboration! Please feel free to email me at
  <a href="mailto:wtwu95@gmail.com">wtwu95@gmail.com</a> or
  <a href="mailto:wen-tao.wu@polyu.edu.hk">wen-tao.wu@polyu.edu.hk</a>.
</p>
<p data-lang="zh" hidden>
  随时欢迎学术交流与合作，可通过
  <a href="mailto:wtwu95@gmail.com">wtwu95@gmail.com</a> 或
  <a href="mailto:wen-tao.wu@polyu.edu.hk">wen-tao.wu@polyu.edu.hk</a> 联系。
</p>

### 📎 Homepages
- Personal Pages: https://wtwu95.github.io (updated recently🔥)
- Google Scholar: https://scholar.google.com/citations?user=e2ban1wAAAAJ

### <span data-lang="en">💬 Recent News</span><span data-lang="zh" hidden>💬 最新动态</span>

{% assign news_items = site.data.news | default: [] %}
{% assign news_count = news_items | size %}
{% assign limit = include.limit %}
{% if limit %}
  {% assign limit = limit | plus: 0 %}
  {% if limit > news_count %}
    {% assign limit = news_count %}
  {% elsif limit < 0 %}
    {% assign limit = 0 %}
  {% endif %}
{% else %}
  {% assign limit = news_count %}
{% endif %}

{% if limit > 0 %}
{% for item in news_items limit: limit %}
{% assign item_en = item.en | default: nil %}
{% assign item_zh = item.zh | default: nil %}
{% if item_en or item_zh %}
- {% if item_en %}<span data-lang="en">{{ item_en }}</span>{% endif %}{% if item_zh %}<span data-lang="zh"{% if item_en %} hidden{% endif %}>{{ item_zh }}</span>{% endif %}
{% else %}
- {{ item }}
{% endif %}
{% endfor %}
{: .news-list}
{% else %}
<p data-lang="en">No news items are available right now. Please check back later.</p>
<p data-lang="zh" hidden>暂无消息更新，欢迎稍后再来查看。</p>
{% endif %}

{% if include.show_button and limit < news_count %}
<!-- <p class="news-actions">
  <a class="btn" href="{{ '/news/' | relative_url }}">
    <span data-lang="en">-- Read More News --</span>
    <span data-lang="zh" hidden>-- 查看更多消息 --</span>
  </a>
</p> -->
{% endif %}

### <span data-lang="en">📚 Publications</span><span data-lang="zh" hidden>📚 论文列表</span>


<div class="publication-controls">
  <input
    type="search"
    id="publication-search"
    class="publication-search"
    placeholder="Search publications..."
    aria-label="Search publications"
    data-placeholder-en="Search publications..."
    data-placeholder-zh="搜索成果..."
    data-aria-label-en="Search publications"
    data-aria-label-zh="搜索成果"
  >
  <select id="publication-type-filter" data-label-en="Type" data-label-zh="类型">
    <option value="all">Type</option>
  </select>
  <select id="publication-year-filter" data-label-en="Date" data-label-zh="日期">
    <option value="all">Date</option>
  </select>
  <button
    type="button"
    id="publication-year-sort"
    class="publication-sort"
    aria-label="Sort by newest"
    data-aria-label-en="Sort by newest"
    data-aria-label-zh="按最新排序"
  >
    <svg
      class="publication-sort-icon"
      viewBox="0 0 1025 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M754.012 538a59.832 59.832 0 0 1 40.055 15.402c24.663 22.223 26.722 60.323 4.6 85.097L557.154 908.976a60.125 60.125 0 0 1-4.6 4.621c-24.661 22.223-62.587 20.154-84.709-4.62L226.332 638.498A60.418 60.418 0 0 1 211 598.261C211 564.98 237.857 538 270.987 538h483.025zM557.155 117.024L798.668 387.5A60.418 60.418 0 0 1 814 427.739C814 461.02 787.143 488 754.013 488H270.988a59.832 59.832 0 0 1-40.055-15.402c-24.663-22.223-26.722-60.323-4.6-85.097l241.513-270.477a60.125 60.125 0 0 1 4.6-4.621c24.661-22.223 62.587-20.154 84.709 4.62z"
        fill="currentColor"
      />
    </svg>
  </button>
</div>

<ol id="publication-list" class="publication-list"></ol>

{% assign publications = site.data.publications %}
<ul id="publication-source" class="publication-source" hidden>
  {% for pub in publications %}
  <li
    data-type="{{ pub.type }}"
    data-year="{{ pub.year }}"
    {% if pub.date %}data-date="{{ pub.date }}"{% endif %}
    {% if pub.citation_plain %}data-citation-plain="{{ pub.citation_plain | escape_once }}"{% endif %}
    {% if pub.citation_bibtex %}data-citation-bibtex="{{ pub.citation_bibtex | replace: '\n', '&#10;' | escape_once }}"{% endif %}
  >
    {{ pub.body_html | strip }}
    {% if pub.scholar_id %}
    <strong><span class="show_paper_citations" data="{{ pub.scholar_id }}"></span></strong>
    {% endif %}
  </li>
  {% endfor %}
</ul>






{% include citation-modal.html %}