## Hi there 👋

# <span data-lang="en">👨🏻‍🎓 Biography</span><span data-lang="zh" hidden>👨🏻‍🎓 个人简介</span>

<p data-lang="en">
  I am currently a Postdoctoral Fellow in
  <a href="https://www.polyu.edu.hk/rclae/">Research Centre for Low Altitude Economy</a>,
  <a href="https://www.polyu.edu.hk/aae/">Department of Aeronautical and Aviation Engineering</a>,
  <a href="https://www.polyu.edu.hk/">The Hong Kong Polytechnic University</a>, under the supervision of Prof.
  <a href="https://scholar.google.com/citations?user=UfIb9GkAAAAJ">Wen-Hua Chen</a>.
</p>
<p data-lang="zh" hidden>
  我目前在<a href="https://www.polyu.edu.hk/rclae/">香港理工大学低空经济研究中心</a>、
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
  in top journals and international conferences such as IEEE T-CYB, IEEE/CAA JAS, IEEE T-ITS, IEEE T-FS, and IEEE CDC.
</p>
<p data-lang="zh" hidden>
  我的研究兴趣包括分布式控制、安全关键控制、强化学习、博弈论及其在自主车辆和多智能体系统中的应用。目前在 IEEE T-CYB、IEEE/CAA JAS、
  IEEE T-ITS、IEEE T-FS、IEEE CDC 等国际顶级期刊与会议发表 SCI/EI 论文 30 余篇
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
  随时欢迎学术交流与合作，可通过邮箱
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

{% assign has_items = news_count > 0 %}
{% assign is_limited = limit < news_count %}

{% if has_items %}
  {% capture years_raw %}{% for item in news_items %}{% if item.year %}{{ item.year }},{% endif %}{% endfor %}{% endcapture %}
  {% capture tags_raw %}{% for item in news_items %}{% if item.tags %}{% for tag in item.tags %}{{ tag }},{% endfor %}{% endif %}{% endfor %}{% endcapture %}
  {% assign year_list = years_raw | split: ',' | uniq | sort | reverse %}
  {% assign tag_list = tags_raw | split: ',' | uniq | sort %}
  {% assign show_tag_filter = false %}
  {% assign show_year_filter = false %}
  {% for tag in tag_list %}
    {% if tag != '' %}
      {% assign show_tag_filter = true %}
    {% endif %}
  {% endfor %}
  {% for year in year_list %}
    {% if year != '' %}
      {% assign show_year_filter = true %}
    {% endif %}
  {% endfor %}

  <div class="news-widget" data-news-widget data-initial-limit="{{ limit }}" data-total-count="{{ news_count }}">
    {% if show_tag_filter or show_year_filter %}
    <div class="news-filters">
      {% if show_tag_filter %}
      <div class="news-filter-group" data-filter-group="tag" role="group">
        <span class="news-filter-label">
          <span data-lang="en">Category</span>
          <span data-lang="zh" hidden>类别</span>
        </span>
        <div class="news-filter-options">
          <button type="button" class="news-filter-button is-active" data-filter-button data-filter-group="tag" data-filter-value="" aria-pressed="true">
            <span data-lang="en">All categories</span>
            <span data-lang="zh" hidden>全部类别</span>
          </button>
          {% for tag in tag_list %}
            {% if tag != '' %}
              {% assign tag_label_en = tag %}
              {% assign tag_label_zh = tag %}
              {% case tag %}
                {% when 'publication' %}
                  {% assign tag_label_en = 'Publications' %}
                  {% assign tag_label_zh = '论文成果' %}
                {% when 'honor' %}
                  {% assign tag_label_en = 'Honors & Awards' %}
                  {% assign tag_label_zh = '荣誉与奖项' %}
                {% when 'program' %}
                  {% assign tag_label_en = 'Programs & Funding' %}
                  {% assign tag_label_zh = '项目与资助' %}
              {% endcase %}
              <button type="button" class="news-filter-button" data-filter-button data-filter-group="tag" data-filter-value="{{ tag }}" aria-pressed="false">
                <span data-lang="en">{{ tag_label_en }}</span>
                <span data-lang="zh" hidden>{{ tag_label_zh }}</span>
              </button>
            {% endif %}
          {% endfor %}
        </div>
      </div>
      {% endif %}

      {% if show_year_filter %}
      <div class="news-filter-group" data-filter-group="year" role="group">
        <span class="news-filter-label">
          <span data-lang="en">Year</span>
          <span data-lang="zh" hidden>年份</span>
        </span>
        <div class="news-filter-options">
          <button type="button" class="news-filter-button is-active" data-filter-button data-filter-group="year" data-filter-value="" aria-pressed="true">
            <span data-lang="en">All years</span>
            <span data-lang="zh" hidden>全部年份</span>
          </button>
          {% for year in year_list %}
            {% if year != '' %}
            <button type="button" class="news-filter-button" data-filter-button data-filter-group="year" data-filter-value="{{ year }}" aria-pressed="false">
              {{ year }}
            </button>
            {% endif %}
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
    {% endif %}

    <ul class="news-list" data-news-list>
      {% for item in news_items %}
        {% assign item_en = item.en | default: nil %}
        {% assign item_zh = item.zh | default: nil %}
        {% assign tags = item.tags | default: nil %}
        {% assign tag_string = '' %}
        {% if tags %}
          {% assign tag_string = tags | join: ' ' %}
        {% endif %}
        <li class="news-item" data-news-item data-tags="{{ tag_string }}"{% if item.year %} data-year="{{ item.year }}"{% endif %}{% if is_limited and forloop.index > limit %} hidden{% endif %}>
          {% if item_en %}<span data-lang="en">{{ item_en }}</span>{% endif %}
          {% if item_zh %}<span data-lang="zh"{% if item_en %} hidden{% endif %}>{{ item_zh }}</span>{% endif %}
        </li>
      {% endfor %}
    </ul>

    <p class="news-empty-message" data-news-empty hidden>
      <span data-lang="en">No news items match the current filters.</span>
      <span data-lang="zh" hidden>没有符合当前筛选条件的消息。</span>
    </p>

    {% if is_limited %}
    <button type="button" class="news-expand-btn" data-action="expand-news" aria-expanded="false">
      <span data-lang="en">Show all news</span>
      <span data-lang="zh" hidden>展开全部</span>
    </button>
    {% endif %}
  </div>
{% else %}
  <p data-lang="en">No news items are available right now. Please check back later.</p>
  <p data-lang="zh" hidden>暂无消息更新，欢迎稍后再来查看。</p>
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

<ul id="publication-source" class="publication-source" hidden>
  <li data-type="journal" data-year="2024" data-date="2024-12" data-citation-plain="W. Wu, Y. Zhang, W. Zhang, R. Ji, and H. Chen, “Saturation-Tolerant Tunnel Prescribed Control for Vessel-Train Formation of Underactuated MSVs,” IEEE Transactions on Vehicular Technology, vol. 73, no. 12, pp. 18380–18390, Dec. 2024." data-citation-bibtex="@ARTICLE{Wu2024Satura,&#10;  author={Wu, Wentao and Zhang, Yibo and Zhang, Weidong and Ji, Ruihang and Chen, Hongtian},&#10;  title={Saturation-Tolerant Tunnel Prescribed Control for Vessel-Train Formation of Underactuated MSVs},&#10;  journal={IEEE Transactions on Vehicular Technology},&#10;  volume={73},&#10;  number={12},&#10;  pages={18380--18390},&#10;  year={2024}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, W. Zhang, R. Ji, and H. Chen, “<a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25">Saturation-Tolerant Tunnel Prescribed Control for Vessel-Train Formation of Underactuated MSVs</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25">IEEE Transactions on Vehicular Technology</a></em>, vol. 73, no. 12, pp. 18380–18390, Dec. 2024. <a href="/assets/papers/SCI/WuWentao-2024-IEEE-TVT.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-11" data-citation-plain="Z. Li, H. Chen, H.-K. Lam, W. Wu, and W. Zhang, “Switched Command-Filtered-Based Adaptive Fuzzy Output-Feedback Funnel Control for Switched Nonlinear MIMO-Delayed Systems,” IEEE Transactions on Fuzzy Systems, vol. 32, no. 11, pp. 6560–6572, Nov. 2024." data-citation-bibtex="@ARTICLE{Li2024Switch,&#10;  author={Li, Zhenhua and Chen, Hongtian and Lam, Hak-Keung and Wu, Wentao and Zhang, Weidong},&#10;  title={Switched Command-Filtered-Based Adaptive Fuzzy Output-Feedback Funnel Control for Switched Nonlinear MIMO-Delayed Systems},&#10;  journal={IEEE Transactions on Fuzzy Systems},&#10;  volume={32},&#10;  number={11},&#10;  pages={6560--6572},&#10;  year={2024}&#10;}">
    <p>Z. Li, H. Chen, H.-K. Lam, <strong>W. Wu</strong>, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10740494">Switched Command-Filtered-Based Adaptive Fuzzy Output-Feedback Funnel Control for Switched Nonlinear MIMO-Delayed Systems</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=91">IEEE Transactions on Fuzzy Systems</a></em>, vol. 32, no. 11, pp. 6560–6572, Nov. 2024. <a href="/assets/papers/SCI/LiZhenhua-2024-IEEE-TFS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-07" data-citation-plain="W. Wu, Y. Zhang, Z. Jia, J.-G. Lu, and W. Zhang, “Adaptive Fault-Tolerant Fuzzy Containment Control for Networked Autonomous Surface Vehicles: A Noncooperative Game Approach,” IEEE Transactions on Fuzzy Systems, vol. 32, no. 7, pp. 4192–4204, Jul. 2024." data-citation-bibtex="@ARTICLE{Wu2024Adapti,&#10;  author={Wu, Wentao and Zhang, Yibo and Jia, Zehua and Lu, Jun-Guo and Zhang, Weidong},&#10;  title={Adaptive Fault-Tolerant Fuzzy Containment Control for Networked Autonomous Surface Vehicles: A Noncooperative Game Approach},&#10;  journal={IEEE Transactions on Fuzzy Systems},&#10;  volume={32},&#10;  number={7},&#10;  pages={4192--4204},&#10;  year={2024}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, Z. Jia, J.-G. Lu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=91">Adaptive Fault-Tolerant Fuzzy Containment Control for Networked Autonomous Surface Vehicles: A Noncooperative Game Approach</a>,”<em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=91">IEEE Transactions on Fuzzy Systems</a></em>, vol. 32, no. 7, pp. 4192–4204, Jul. 2024. <a href="/assets/papers/SCI/WuWentao-2024-IEEE-TFS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2024-IEEE-TFS.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-08" data-citation-plain="D. Wu, Y. Zhang, W. Wu, E. Q. Wu, and W. Zhang, “Tunnel Prescribed Performance Control for Distributed Path Maneuvering of Multi-UAV Swarms via Distributed Neural Predictor,” IEEE Transactions on Circuits and Systems II: Express Briefs, vol. 71, no. 8, pp. 3830–3834, Aug. 2024." data-citation-bibtex="@ARTICLE{Wu2024Tunnel,&#10;  author={Wu, Di and Zhang, Yibo and Wu, Wentao and Wu, Edmond Q. and Zhang, Weidong},&#10;  title={Tunnel Prescribed Performance Control for Distributed Path Maneuvering of Multi-UAV Swarms via Distributed Neural Predictor},&#10;  journal={IEEE Transactions on Circuits and Systems II: Express Briefs},&#10;  volume={71},&#10;  number={8},&#10;  pages={3830--3834},&#10;  year={2024}&#10;}">
    <p>D. Wu, Y. Zhang, <strong>W. Wu</strong>, E. Q. Wu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10462491">Tunnel Prescribed Performance Control for Distributed Path Maneuvering of Multi-UAV Swarms via Distributed Neural Predictor</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8920">IEEE Transactions on Circuits and Systems II: Express Briefs</a></em>, vol. 71, no. 8, pp. 3830–3834, Aug. 2024. <a href="/assets/papers/SCI/WuDi-2024-IEEE-TCSII.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-08" data-citation-plain="Z. Li, H. Chen, W. Wu, and W. Zhang, “Dynamic Output Feedback Fault-Tolerant Control for Switched Vehicle Active Suspension Delayed Systems,” IEEE Transactions on Vehicular Technology, vol. 73, no. 8, pp. 11059–11071, Aug. 2024." data-citation-bibtex="@ARTICLE{Li2024Dynami,&#10;  author={Li, Zhenhua and Chen, Hongtian and Wu, Wentao and Zhang, Weidong},&#10;  title={Dynamic Output Feedback Fault-Tolerant Control for Switched Vehicle Active Suspension Delayed Systems},&#10;  journal={IEEE Transactions on Vehicular Technology},&#10;  volume={73},&#10;  number={8},&#10;  pages={11059--11071},&#10;  year={2024}&#10;}">
    <p>Z. Li, H. Chen, <strong>W. Wu</strong>, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10449447">Dynamic Output Feedback Fault-Tolerant Control for Switched Vehicle Active Suspension Delayed Systems</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=25">IEEE Transactions on Vehicular Technology</a></em>, vol. 73, no. 8, pp. 11059–11071, Aug. 2024. <a href="/assets/papers/SCI/LiZhenhua-2024-IEEE-TVT.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-07" data-citation-plain="Y. Zhang, W. Wu, W. Chen, H. Lu, and W. Zhang, “Output-Feedback Consensus Maneuvering of Uncertain MIMO Strict-Feedback Multiagent Systems Based on a High-Order Neural Observer,” IEEE Transactions on Cybernetics, vol. 54, no. 7, pp. 4111–4123, Jul. 2024." data-citation-bibtex="@ARTICLE{Zhang2024Output,&#10;  author={Zhang, Yibo and Wu, Wentao and Chen, Weixing and Lu, Haibo and Zhang, Weidong},&#10;  title={Output-Feedback Consensus Maneuvering of Uncertain MIMO Strict-Feedback Multiagent Systems Based on a High-Order Neural Observer},&#10;  journal={IEEE Transactions on Cybernetics},&#10;  volume={54},&#10;  number={7},&#10;  pages={4111--4123},&#10;  year={2024}&#10;}">
    <p>Y. Zhang, <strong>W. Wu</strong>, W. Chen, H. Lu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10416809">Output-Feedback Consensus Maneuvering of Uncertain MIMO Strict-Feedback Multiagent Systems Based on a High-Order Neural Observer</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036">IEEE Transactions on Cybernetics</a></em>, vol. 54, no. 7, pp. 4111–4123, Jul. 2024. <a href="/assets/papers/SCI/ZhangYibo-2024-IEEE-TCYB.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2025" data-date="2025-01" data-citation-plain="W. Wu, Y. Zhang, Z. Li, J.-G. Lu, and W. Zhang, “Constrained Safe Cooperative Maneuvering of Autonomous Surface Vehicles: A Control Barrier Function Approach,” IEEE Transactions on Systems, Man, and Cybernetics: Systems, vol. 55, no. 1, pp. 73–84, Jan. 2025." data-citation-bibtex="@ARTICLE{Wu2025Constr,&#10;  author={Wu, Wentao and Zhang, Yibo and Li, Zhenhua and Lu, Jun-Guo and Zhang, Weidong},&#10;  title={Constrained Safe Cooperative Maneuvering of Autonomous Surface Vehicles: A Control Barrier Function Approach},&#10;  journal={IEEE Transactions on Systems, Man, and Cybernetics: Systems},&#10;  volume={55},&#10;  number={1},&#10;  pages={73--84},&#10;  year={2025}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, Z. Li, J.-G. Lu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10414035">Constrained Safe Cooperative Maneuvering of Autonomous Surface Vehicles: A Control Barrier Function Approach</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221021">IEEE Transactions on Systems, Man, and Cybernetics: Systems</a></em>, vol. 55, no. 1, pp. 73–84, Jan. 2025. <a href="/assets/papers/SCI/WuWentao-2023-IEEE-TSMCA.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2023-IEEE-TSMCA.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:_kc_bZDykSQC'></span></strong>
  </li>
  <li data-type="journal" data-year="2025" data-date="2025-06" data-citation-plain="Z. Li, H. Chen, W. Wu, Z. Jia, and W. Zhang, “Decentralized Finite-Time Adaptive Neural Output-Feedback Quantized Control for Switched Nonlinear Large-Scale Delayed Systems,” International Journal of Robust and Nonlinear Control, vol. 35, no. 6, pp. 1907–1920, 2025." data-citation-bibtex="@ARTICLE{Li2025Decent,&#10;  author={Li, Zhenhua and Chen, Hongtian and Wu, Wentao and Jia, Zehua and Zhang, Weidong},&#10;  title={Decentralized Finite-Time Adaptive Neural Output-Feedback Quantized Control for Switched Nonlinear Large-Scale Delayed Systems},&#10;  journal={International Journal of Robust and Nonlinear Control},&#10;  volume={35},&#10;  number={6},&#10;  pages={1907--1920},&#10;  year={2025}&#10;}">
    <p>Z. Li, H. Chen, <strong>W. Wu</strong>, Z. Jia, and W. Zhang, “<a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/rnc.7765">Decentralized Finite-Time Adaptive Neural Output-Feedback Quantized Control for Switched Nonlinear Large-Scale Delayed Systems</a>,” <em class="publication-venue publication-venue--english-journal"><a href="https://onlinelibrary.wiley.com/journal/10991239">International Journal of Robust and Nonlinear Control</a></em>, vol. 35, no. 6, pp. 1907–1920, 2025. <a href="/assets/papers/SCI/LiZhenhua-2025-IJRNC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:roLk4NBRz8UC'></span></strong>
  </li>
  <li data-type="journal" data-year="2025" data-date="2025-08" data-citation-plain="X. Dong, T. Xie, W. Wu, H. Chen, C. Zhang, and W. Zhang, “A Nonsmooth Dynamic Output Feedback Strategy for Nonlinear Systems with Nonparametric Uncertainties: Application to Robot Manipulators,” IEEE Transactions on Industrial Electronics2025. doi: 10.1109/TIE.2025.3600515." data-citation-bibtex="@ARTICLE{Dong2025Anonsm,&#10;  author={Dong, X. and Xie, Tao and Wu, Wentao and Chen, Hongtian and Zhang, Chenming and Zhang, Weidong},&#10;  title={A Nonsmooth Dynamic Output Feedback Strategy for Nonlinear Systems with Nonparametric Uncertainties: Application to Robot Manipulators},&#10;  journal={IEEE Transactions on Industrial Electronics},&#10;  year={2025},&#10; doi={10.1109/TIE.2025.3600515}&#10;}">
    <p>X. Dong, T. Xie, <strong>W. Wu</strong>, H. Chen, C. Zhang, and W. Zhang, “<a href=" ">A Nonsmooth Dynamic Output Feedback Strategy for Nonlinear Systems with Nonparametric Uncertainties: Application to Robot Manipulators</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=41">IEEE Transactions on Industrial Electronics</a></em>, 2025. doi: 10.1109/TIE.2025.3600515. <a href="/assets/papers/SCI/DongXin-2025-IEEE-TIE.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:2KloaMYe4IUC'></span></strong>
  </li>
  <li data-type="journal" data-year="2025" data-date="2025-08" data-citation-plain="L. Guo, W. Cao, W. Hu, W. Wu, and M. Wu, “Fuzzy Non-Uniform Sampling for Inverse Decision-Making Modeling to Tune Microwave Filters,” IEEE Transactions on Fuzzy Systems, 2025. doi: 10.1109/TFUZZ.2025.3604594." data-citation-bibtex="@ARTICLE{Guo2025Fuzzyn,&#10;  author={Guo, L. and Cao, W. and Hu, W. and Wu, Wentao and Wu, M.},&#10;  title={Fuzzy Non-Uniform Sampling for Inverse Decision-Making Modeling to Tune Microwave Filters},&#10;  journal={IEEE Transactions on Fuzzy Systems},&#10;  year={2025},&#10; doi={10.1109/TFUZZ.2025.3604594}&#10;}">
    <p>L. Guo, W. Cao, W. Hu, <strong>W. Wu</strong>, and M. Wu, “<a href="https://ieeexplore.ieee.org/document/11164660">Fuzzy Non-Uniform Sampling for Inverse Decision-Making Modeling to Tune Microwave Filters</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=91">IEEE Transactions on Fuzzy Systems</a></em>, 2025. doi: 10.1109/TFUZZ.2025.3604594. <a href="/assets/papers/SCI/GuoLinwei-2025-IEEE-TFS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:ufrVoPGSRksC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-04" data-citation-plain="Y. Zhang, D. Wu, P. Cheng, W. Wu, and W. Zhang, “Robust Adaptive Fault-Tolerant Control for Path Maneuvering of Autonomous Surface Vehicles with Actuator Faults Based on the Noncooperative Game Strategy,” Ocean Engineering, vol. 292, Apr. 2024." data-citation-bibtex="@ARTICLE{Zhang2024Robust,&#10;  author={Zhang, Yibo and Wu, Di and Cheng, Peng and Wu, Wentao and Zhang, Weidong},&#10;  title={Robust Adaptive Fault-Tolerant Control for Path Maneuvering of Autonomous Surface Vehicles with Actuator Faults Based on the Noncooperative Game Strategy},&#10;  journal={Ocean Engineering},&#10;  volume={292},&#10;  year={2024}&#10;}">
    <p>Y. Zhang, D. Wu, P. Cheng, <strong>W. Wu</strong>, and W. Zhang, “<a href="https://www.sciencedirect.com/science/article/pii/S0029801823029256?dgcid=coauthor">Robust Adaptive Fault-Tolerant Control for Path Maneuvering of Autonomous Surface Vehicles with Actuator Faults Based on the Noncooperative Game Strategy</a>,” <em class="publication-venue publication-venue--english-journal"><a href="https://www.sciencedirect.com/journal/ocean-engineering">Ocean Engineering</a></em>, vol. 292, Apr. 2024. <a href="/assets/papers/SCI/ZhangYibo-2023-OE.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:YOwf2qJgpHMC'></span></strong>
  </li>
  <li data-type="journal" data-year="2023" data-date="2023-02" data-citation-plain="W. Wu, R. Ji, W. Zhang, and Y. Zhang, “Transient-Reinforced Tunnel Coordinated Control of Underactuated Marine Surface Vehicles with Actuator Faults,” IEEE Transactions on Intelligent Transportation Systems, vol. 25, no. 2, pp. 1872–1881, Feb. 2023." data-citation-bibtex="@ARTICLE{Wu2023Transi,&#10;  author={Wu, Wentao and Ji, Ruihang and Zhang, Weidong and Zhang, Yibo},&#10;  title={Transient-Reinforced Tunnel Coordinated Control of Underactuated Marine Surface Vehicles with Actuator Faults},&#10;  journal={IEEE Transactions on Intelligent Transportation Systems},&#10;  volume={25},&#10;  number={2},&#10;  pages={1872--1881},&#10;  year={2023}&#10;}">
    <p><strong>W. Wu</strong>, R. Ji, W. Zhang, and Y. Zhang, “<a href="https://ieeexplore.ieee.org/document/10292769">Transient-Reinforced Tunnel Coordinated Control of Underactuated Marine Surface Vehicles with Actuator Faults</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6979">IEEE Transactions on Intelligent Transportation Systems</a></em>, vol. 25, no. 2, pp. 1872–1881, Feb. 2023. <a href="/assets/papers/SCI/WuWentao-2023-IEEE-TITS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2023-IEEE-TITS.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:ULOm3_A8WrAC'></span></strong>
  </li>
  <li data-type="journal" data-year="2024" data-date="2024-09" data-citation-plain="W. Wu, D. Wu, Y. Zhang, S. Chen, and W. Zhang, “Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance,” IEEE/CAA Journal of Automatica Sinica, vol. 11, no. 9, pp. 2033–2035, Sept. 2024." data-citation-bibtex="@ARTICLE{Wu2024Safety,&#10;  author={Wu, Wentao and Wu, Di and Zhang, Yibo and Chen, Shukang and Zhang, Weidong},&#10;  title={Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance},&#10;  journal={IEEE/CAA Journal of Automatica Sinica},&#10;  volume={11},&#10;  number={9},&#10;  pages={2033--2035},&#10;  year={2024}&#10;}">
    <p><strong>W. Wu</strong>, D. Wu, Y. Zhang, S. Chen, and W. Zhang, “<a href="/assets/papers/SCI/WuWentao-2023-IEEE-JAS.pdf">Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570654">IEEE/CAA Journal of Automatica Sinica</a></em>, vol. 11, no. 9, pp. 2033–2035, Sept. 2024. <a href="/assets/papers/SCI/WuWentao-2023-IEEE-JAS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2023-IEEE-JAS.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a> <a href="/assets/Video/Video-Exp/WuWentao-2023-IEEE-JASa.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Expa--Demo-blue?label=Video"/></a> <a href="/assets/Video/Video-Exp/WuWentao-2023-IEEE-JASb.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Expb--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:ULOm3_A8WrAC'></span></strong>
  </li>
  <li data-type="journal" data-year="2023" data-date="2023-08" data-citation-plain="Y. Zhang, W. Wu, J. Lu, and W. Zhang, “Neural Predictor-Based Dynamic Surface Parallel Control for MIMO Uncertain Nonlinear Strict-Feedback Systems,” IEEE Transactions on Circuits and Systems II: Express Briefs, vol. 70, no. 8, pp. 2909–2913, Aug. 2023." data-citation-bibtex="@ARTICLE{Zhang2023Neural,&#10;  author={Zhang, Yibo and Wu, Wentao and Lu, Jinhui and Zhang, Weidong},&#10;  title={Neural Predictor-Based Dynamic Surface Parallel Control for MIMO Uncertain Nonlinear Strict-Feedback Systems},&#10;  journal={IEEE Transactions on Circuits and Systems II: Express Briefs},&#10;  volume={70},&#10;  number={8},&#10;  pages={2909--2913},&#10;  year={2023}&#10;}">
    <p>Y. Zhang, <strong>W. Wu</strong>, J. Lu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/abstract/document/10059139">Neural Predictor-Based Dynamic Surface Parallel Control for MIMO Uncertain Nonlinear Strict-Feedback Systems</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8920">IEEE Transactions on Circuits and Systems II: Express Briefs</a></em>, vol. 70, no. 8, pp. 2909–2913, Aug. 2023. <a href="/assets/papers/SCI/ZhangYibo-2023-IEEE-TCASII.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:8k81kl-MbHgC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-11" data-citation-plain="Y. Zhang, W. Wu, and W. Zhang, “Noncooperative Game-Based Cooperative Maneuvering of Intelligent Surface Vehicles Via Accelerated Learning-Based Neural Predictors,” IEEE Transactions on Intelligent Vehicles, vol. 8, no. 3, pp. 2212–2221, Mar. 2023." data-citation-bibtex="@ARTICLE{Zhang2023Noncoo,&#10;  author={Zhang, Yibo and Wu, Wentao and Zhang, Weidong},&#10;  title={Noncooperative Game-Based Cooperative Maneuvering of Intelligent Surface Vehicles Via Accelerated Learning-Based Neural Predictors},&#10;  journal={IEEE Transactions on Intelligent Vehicles},&#10;  volume={8},&#10;  number={3},&#10;  pages={2212--2221},&#10;  year={2023}&#10;}">
    <p>Y. Zhang, <strong>W. Wu</strong>, and W. Zhang, “<a href="https://ieeexplore.ieee.org/abstract/document/9950329">Noncooperative Game-Based Cooperative Maneuvering of Intelligent Surface Vehicles Via Accelerated Learning-Based Neural Predictors</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857">IEEE Transactions on Intelligent Vehicles</a></em>, vol. 8, no. 3, pp. 2212–2221, Mar. 2023. <a href="/assets/papers/SCI/ZhangYibo-2022-IEEE-TIV.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:KlAtU1dfN6UC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-10" data-citation-plain="W. Wu, Y. Zhang, W. Zhang, and W. Xie, “Distributed Finite-Time Performance-Prescribed Time-Varying Formation Control of Autonomous Surface Vehicles with Saturated Inputs,” Ocean Engineering, vol. 266, Oct. 2022." data-citation-bibtex="@ARTICLE{Wu2022Distri,&#10;  author={Wu, Wentao and Zhang, Yibo and Zhang, Weidong and Xie, Wei},&#10;  title={Distributed Finite-Time Performance-Prescribed Time-Varying Formation Control of Autonomous Surface Vehicles with Saturated Inputs},&#10;  journal={Ocean Engineering},&#10;  volume={266},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, W. Zhang, and W. Xie, “<a href="https://www.sciencedirect.com/science/article/abs/pii/S0029801822021497">Distributed Finite-Time Performance-Prescribed Time-Varying Formation Control of Autonomous Surface Vehicles with Saturated Inputs</a>,” <em class="publication-venue publication-venue--english-journal"><a href="https://www.sciencedirect.com/journal/ocean-engineering">Ocean Engineering</a></em>, vol. 266, Oct. 2022. <a href="/assets/papers/SCI/WuWentao-2022-OEb.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2022-OEb.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:LkGwnXOMwfcC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-09" data-citation-plain="W. Wu, Y. Zhang, W. Zhang, and W. Xie, “Output-Feedback Finite-Time Safety-Critical Coordinated Control of Path-Guided Marine Surface Vehicles Based on Neurodynamic Optimization,” IEEE Transactions on Systems, Man, and Cybernetics: Systems, vol. 53, no. 3, pp. 1788–1800, Sept. 2022." data-citation-bibtex="@ARTICLE{Wu2022Output,&#10;  author={Wu, Wentao and Zhang, Yibo and Zhang, Weidong and Xie, Wei},&#10;  title={Output-Feedback Finite-Time Safety-Critical Coordinated Control of Path-Guided Marine Surface Vehicles Based on Neurodynamic Optimization},&#10;  journal={IEEE Transactions on Systems, Man, and Cybernetics: Systems},&#10;  volume={53},&#10;  number={3},&#10;  pages={1788--1800},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, W. Zhang, and W. Xie, “<a href="https://ieeexplore.ieee.org/abstract/document/9900363">Output-Feedback Finite-Time Safety-Critical Coordinated Control of Path-Guided Marine Surface Vehicles Based on Neurodynamic Optimization</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221021">IEEE Transactions on Systems, Man, and Cybernetics: Systems</a></em>, vol. 53, no. 3, pp. 1788–1800, Sept. 2022. <a href="/assets/papers/SCI/WuWentao-2022-IEEE-TSMCA.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2022-IEEE-TSMCA.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:ufrVoPGSRksC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-08" data-citation-plain="X. Ren, M. Li, Z. Liu, Z. Li, W. Wu, L. Bai, and W. Zhang, “Curiosity-Driven Attention for Anomaly Road Obstacles Segmentation in Autonomous Driving,” IEEE Transactions on Intelligent Vehicles, vol. 8, no. 3, pp. 2233–2243, Mar. 2023." data-citation-bibtex="@ARTICLE{Ren2023Curios,&#10;  author={Ren, Xiangxuan and Li, Min and Liu, Zhi and Li, Zhenhua and Wu, Wentao and Bai, Lin and Zhang, Weidong},&#10;  title={Curiosity-Driven Attention for Anomaly Road Obstacles Segmentation in Autonomous Driving},&#10;  journal={IEEE Transactions on Intelligent Vehicles},&#10;  volume={8},&#10;  number={3},&#10;  pages={2233--2243},&#10;  year={2023}&#10;}">
    <p>X. Ren, M. Li, Z. Liu, Z. Li, <strong>W. Wu</strong>, L. Bai, and W. Zhang, “<a href="https://ieeexplore.ieee.org/abstract/document/9878245">Curiosity-Driven Attention for Anomaly Road Obstacles Segmentation in Autonomous Driving</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857">IEEE Transactions on Intelligent Vehicles</a></em>, vol. 8, no. 3, pp. 2233–2243, Mar. 2023. <a href="/assets/papers/SCI/RenXiangxuan-2022-IEEE-TIV.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:Y0pCki6q_DkC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-04" data-citation-plain="W. Wu, Z. Peng, L. Liu, and D. Wang, “A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train,” IEEE Transactions on Intelligent Vehicles, vol. 7, no. 3, pp. 627–637, Sept. 2022." data-citation-bibtex="@ARTICLE{Wu2022Agener,&#10;  author={Wu, Wentao and Peng, Zhouhua and Liu, Lu and Wang, Dan},&#10;  title={A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train},&#10;  journal={IEEE Transactions on Intelligent Vehicles},&#10;  volume={7},&#10;  number={3},&#10;  pages={627--637},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Z. Peng, L. Liu, and D. Wang, “<a href="https://ieeexplore.ieee.org/abstract/document/9762043">A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857">IEEE Transactions on Intelligent Vehicles</a></em>, vol. 7, no. 3, pp. 627–637, Sept. 2022. <a href="/assets/papers/SCI/WuWentao-2022-IEEE-TIV.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href="/assets/Video/Video-Sim/WuWentao-2022-IEEE-TIV.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:UeHWp8X0CEIC'></span></strong>
  </li>
  <li data-type="journal" data-year="2022" data-date="2022-01" data-citation-plain="W. Wu, Z. Peng, D. Wang, L. Liu, and N. Gu, “Anti-Disturbance Leader–Follower Synchronization Control of Marine Vessels for Underway Replenishment Based on Robust Exact Differentiators,” Ocean Engineering, vol. 248, Jan. 2022." data-citation-bibtex="@ARTICLE{Wu2022Antidi,&#10;  author={Wu, Wentao and Peng, Zhouhua and Wang, Dan and Liu, Lu and Gu, Nan},&#10;  title={Anti-Disturbance Leader–Follower Synchronization Control of Marine Vessels for Underway Replenishment Based on Robust Exact Differentiators},&#10;  journal={Ocean Engineering},&#10;  volume={248},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Z. Peng, D. Wang, L. Liu, and N. Gu, “<a href="https://www.sciencedirect.com/science/article/abs/pii/S0029801822001445">Anti-Disturbance Leader–Follower Synchronization Control of Marine Vessels for Underway Replenishment Based on Robust Exact Differentiators</a>,” <em class="publication-venue publication-venue--english-journal"><a href="https://www.sciencedirect.com/journal/ocean-engineering">Ocean Engineering</a></em>, vol. 248, Jan. 2022. <a href="/assets/papers/SCI/WuWentao-2022-OE.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:qjMakFHDy7sC'></span></strong>
  </li>
  <li data-type="journal" data-year="2021" data-date="2021-04" data-citation-plain="W. Wu, Z. Peng, D. Wang, L. Liu, and Q.-L. Han, “Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results,” IEEE Transactions on Cybernetics, vol. 52, no. 10, pp. 10937–10947, Oct. 2022." data-citation-bibtex="@ARTICLE{Wu2022Networ,&#10;  author={Wu, Wentao and Peng, Zhouhua and Wang, Dan and Liu, Lu and Han, Qing-Long},&#10;  title={Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results},&#10;  journal={IEEE Transactions on Cybernetics},&#10;  volume={52},&#10;  number={10},&#10;  pages={10937--10947},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Z. Peng, D. Wang, L. Liu, and Q.-L. Han, “<a href="https://ieeexplore.ieee.org/abstract/document/9440777">Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results</a>,” <em class="publication-venue publication-venue--ieee-journal"><a href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036">IEEE Transactions on Cybernetics</a></em>, vol. 52, no. 10, pp. 10937–10947, Oct. 2022. <a href="/assets/papers/SCI/WuWentao-2021-IEEE-TCYB.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:W7OEmFMy1HYC'></span></strong>
  </li>
  <li data-type="review" data-year="2021" data-date="2021-01" data-citation-plain="彭周华, 吴文涛, 王丹, 刘陆, “多无人艇集群协同控制研究进展与未来趋势,” 中国舰船研究, vol. 61, no. 1, pp. 51–64, 2021." data-citation-bibtex="@ARTICLE{Peng2021,&#10;  author={彭周华, 吴文涛, 王丹, 刘陆},&#10;  title={多无人艇集群协同控制研究进展与未来趋势},&#10;  journal={中国舰船研究},&#10;  volume={61},&#10;  number={1},&#10;  pages={51--64},&#10;  year={2021}&#10;}">
    <p>彭周华, <strong>吴文涛</strong>, 王丹, 刘陆, “<a href="http://zgjcyj.xml-journal.net/cn/article/doi/10.19693/j.issn.1673-3185.01923">多无人艇集群协同控制研究进展与未来趋势</a>,” <em class="publication-venue publication-venue--chinese-journal"><a href="http://zgjcyj.xml-journal.net/index.htm">中国舰船研究</a></em>, vol. 61, no. 1, pp. 51–64, 2021. <a href="/assets/papers/ZWHX/J-核心-2020-Pengzhouhua-中国舰船研究.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:0EnyYjriUFMC'></span></strong>
  </li>
  <li data-type="journal" data-year="2021" data-date="2021-01" data-citation-plain="吴文涛, 彭周华, 王丹, 刘陆, 姜继洲, 任帅, “基于扩张状态观测器的双桨推进无人艇抗干扰目标跟踪控制,” 中国舰船研究, vol. 61, no. 1, pp. 128–135, 2021." data-citation-bibtex="@ARTICLE{Wu2021,&#10;  author={吴文涛, 彭周华, 王丹, 刘陆, 姜继洲, 任帅},&#10;  title={基于扩张状态观测器的双桨推进无人艇抗干扰目标跟踪控制},&#10;  journal={中国舰船研究},&#10;  volume={61},&#10;  number={1},&#10;  pages={128--135},&#10;  year={2021}&#10;}">
    <p><strong>吴文涛</strong>, 彭周华, 王丹, 刘陆, 姜继洲, 任帅, “<a href="http://www.ship-research.com/cn/article/doi/10.19693/j.issn.1673-3185.01665?viewType=HTML">基于扩张状态观测器的双桨推进无人艇抗干扰目标跟踪控制</a>,” <em class="publication-venue publication-venue--chinese-journal"><a href="http://zgjcyj.xml-journal.net/index.htm">中国舰船研究</a></em>, vol. 61, no. 1, pp. 128–135, 2021. <a href="/assets/papers/ZWHX/J-核心-2020-WuWentao-中国舰船研究a.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:Tyk-4Ss8FVUC'></span></strong>
  </li>
  <li data-type="journal" data-year="2020" data-date="2020-09" data-citation-plain="吴文涛, 古楠, 彭周华, 刘陆, 王丹, “多领航者导引无人船集群的分布式时变队形控制,” 中国舰船研究, vol. 15, no. 1, pp. 21–30, 2020." data-citation-bibtex="@ARTICLE{Wu2020,&#10;  author={吴文涛, 古楠, 彭周华, 刘陆, 王丹},&#10;  title={多领航者导引无人船集群的分布式时变队形控制},&#10;  journal={中国舰船研究},&#10;  volume={15},&#10;  number={1},&#10;  pages={21--30},&#10;  year={2020}&#10;}">
    <p><strong>吴文涛</strong>, 古楠, 彭周华, 刘陆, 王丹, “<a href="https://web.archive.org/web/20201126111532id_/http://html.rhhz.net/ZGJCYJ/html/2020-1-21.htm">多领航者导引无人船集群的分布式时变队形控制</a>,” <em class="publication-venue publication-venue--chinese-journal"><a href="http://zgjcyj.xml-journal.net/index.htm">中国舰船研究</a></em>, vol. 15, no. 1, pp. 21–30, 2020. <a href="/assets/papers/ZWHX/J-核心-2020-WuWentao-中国舰船研究b.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
    <strong><span class='show_paper_citations' data='WGp4lBIAAAAJ:5nxA0vEk-isC'></span></strong>
  </li>
  <li data-type="conference" data-year="2024" data-date="2024-07" data-citation-plain="Y. Zhang, W. Wu, T. Xie, P. Cheng, D. Wu, and W. Zhang, “Maneuvering Control of Uncertain Nonlinear Systems: An Output Regulation Viewpoint,” in 2024 63rd IEEE Conference on Decision and Control (CDC), pp. 2928-2933, 2024." data-citation-bibtex="@INPROCEEDINGS{Zhang2024Maneuv,&#10;  author={Zhang, Yibo and Wu, Wentao and Xie, Tao and Cheng, Peng and Wu, Di and Zhang, Weidong},&#10;  title={Maneuvering Control of Uncertain Nonlinear Systems: An Output Regulation Viewpoint},&#10;  booktitle={2024 63rd IEEE Conference on Decision and Control (CDC)},&#10;  year={2024},&#10; pages={2928-2933}&#10;}">
    <p>Y. Zhang, <strong>W. Wu</strong>, T. Xie, P. Cheng, D. Wu, and W. Zhang, “<a href="https://ieeexplore.ieee.org/document/10886193">Maneuvering Control of Uncertain Nonlinear Systems: An Output Regulation Viewpoint</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/10885784/proceeding">2024 63rd IEEE Conference on Decision and Control (CDC)</a></em>, pp. 2928-2933, 2024. <a href="/assets/papers/EI/2024_CDC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
  <li data-type="conference" data-year="2023" data-date="2023-09" data-citation-plain="W. Wu, C. Zhang, Z. Li, W. Zhang, and Y. Zhang, “Finite-time Extended State Observer-Based Performance-Critical Control for Uncertain MIMO Nonlinear Systems,” in 2023 7th Chinese Conference on Swarm Intelligence and Cooperative Control (CCSICC), pp. 178-191, 2023." data-citation-bibtex="@INPROCEEDINGS{Wu2023Finite,&#10;  author={Wu, Wentao and Zhang, Chenming and Li, Zhenhua and Zhang, Weidong and Zhang, Yibo},&#10;  title={Finite-time Extended State Observer-Based Performance-Critical Control for Uncertain MIMO Nonlinear Systems},&#10;  booktitle={2023 7th Chinese Conference on Swarm Intelligence and Cooperative Control (CCSICC)},&#10;  year={2023}&#10; pages={178-191}&#10;}">
    <p><strong>W. Wu</strong>, C. Zhang, Z. Li, W. Zhang, and Y. Zhang, “<a href="https://link.springer.com/chapter/10.1007/978-981-97-3328-6_16">Finite-time Extended State Observer-Based Performance-Critical Control for Uncertain MIMO Nonlinear Systems</a>,” in <em class="publication-venue publication-venue--conference"><a href="http://ccsicc.c2.org.cn/">2023 7th Chinese Conference on Swarm Intelligence and Cooperative Control (CCSICC)</a></em>, pp. 178-191, 2023. <a href="/assets/papers/EI/2023-CCSICC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a> <a href=" "><img alt="Award badge" src="https://img.shields.io/badge/%F0%9F%8E%89Best%20Student%20Paper%20Nomination%20Award-8A2BE2"/></a></p>
  </li>
  <li data-type="conference" data-year="2023" data-date="2023-09" data-citation-plain="W. Wu, Z. Li, Y. Zhang, and W. Zhang, “Noncooperative Containment Control for Multiple Unmanned Surface Vehicles With Improved Extended State Observer,” in 2023 China Automation Congress (CAC), pp. 1313-1318, 2023." data-citation-bibtex="@INPROCEEDINGS{Wu2023Noncoo,&#10;  author={Wu, Wentao and Li, Zhenhua and Zhang, Yibo and Zhang, Weidong},&#10;  title={Noncooperative Containment Control for Multiple Unmanned Surface Vehicles With Improved Extended State Observer},&#10;  booktitle={2023 China Automation Congress (CAC)},&#10;  year={2023}&#10; pages={1313-1318}&#10;}">
    <p><strong>W. Wu</strong>, Z. Li, Y. Zhang, and W. Zhang, “<a href="https://ieeexplore.ieee.org/abstract/document/10451380">Noncooperative Containment Control for Multiple Unmanned Surface Vehicles With Improved Extended State Observer</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/10450150/proceeding">2023 China Automation Congress (CAC)</a></em>, pp. 1313-1318, 2023. <a href="/assets/papers/EI/2023-CAC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
  <li data-type="conference" data-year="2022" data-date="2022-09" data-citation-plain="Y. Zhang, W. Wu, D. Wu, Y. Wang, and W. Zhang, “DSC-based Parallel Control for Consensus Maneuvering of Multi-agent Systems subject to Unmatched Uncertainties based on Distributed Nash Equilibrium Seeking,” in 2022 China Automation Congress (CAC), IEEE, pp. 1125–1130, 2022." data-citation-bibtex="@INPROCEEDINGS{Zhang2022Dscbas,&#10;  author={Zhang, Yibo and Wu, Wentao and Wu, Di and Wang, Yuanhui and Zhang, Weidong},&#10;  title={DSC-based Parallel Control for Consensus Maneuvering of Multi-agent Systems subject to Unmatched Uncertainties based on Distributed Nash Equilibrium Seeking},&#10;  booktitle={2022 China Automation Congress (CAC)},&#10;  organization={IEEE},&#10;  pages={1125--1130},&#10;  year={2022}&#10;}">
    <p>Y. Zhang, <strong>W. Wu</strong>, D. Wu, Y. Wang, and W. Zhang, “<a href="https://ieeexplore.ieee.org/abstract/document/10056005">DSC-based Parallel Control for Consensus Maneuvering of Multi-agent Systems subject to Unmatched Uncertainties based on Distributed Nash Equilibrium Seeking</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/10054511/proceeding">2022 China Automation Congress (CAC)</a></em>, IEEE, pp. 1125–1130, 2022. <a href="/assets/papers/EI/ZhangYibo-2022-CAC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
  <li data-type="conference" data-year="2022" data-date="2022-04" data-citation-plain="W. Wu, Y. Zhang, W. Zhang, and D. Wu, “Safety-Certified Consensus Control of Multi-Agent Systems Based on Finite-Time Control Barrier Function,” in 2022 41th Chinese Control Conference (CCC), IEEE, pp. 4661–4665, 2022." data-citation-bibtex="@INPROCEEDINGS{Wu2022Safety,&#10;  author={Wu, Wentao and Zhang, Yibo and Zhang, Weidong and Wu, Di},&#10;  title={Safety-Certified Consensus Control of Multi-Agent Systems Based on Finite-Time Control Barrier Function},&#10;  booktitle={2022 41th Chinese Control Conference (CCC)},&#10;  organization={IEEE},&#10;  pages={4661--4665},&#10;  year={2022}&#10;}">
    <p><strong>W. Wu</strong>, Y. Zhang, W. Zhang, and D. Wu, “<a href="https://ieeexplore.ieee.org/abstract/document/9902172">Safety-Certified Consensus Control of Multi-Agent Systems Based on Finite-Time Control Barrier Function</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/9901509/proceeding">2022 41th Chinese Control Conference (CCC)</a></em>, IEEE, pp. 4661–4665, 2022. <a href="/assets/papers/EI/2022-CCC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
  <li data-type="conference" data-year="2020" data-date="2020-04" data-citation-plain="W. Wu, D. Wang, M. Lv, J. Jiang, L. Liu, and Z. Peng, “Event-triggered LOS Guidance for Path Following of an Unmanned Surface Vehicle over Wireless Network,” in 2020 39th Chinese Control Conference (CCC), IEEE, pp. 4475–4480, 2020." data-citation-bibtex="@INPROCEEDINGS{Wu2020Eventt,&#10;  author={Wu, Wentao and Wang, Dan and Lv, Mingao and Jiang, Jizhou and Liu, Lu and Peng, Zhouhua},&#10;  title={Event-triggered LOS Guidance for Path Following of an Unmanned Surface Vehicle over Wireless Network},&#10;  booktitle={2020 39th Chinese Control Conference (CCC)},&#10;  organization={IEEE},&#10;  pages={4475--4480},&#10;  year={2020}&#10;}">
    <p><strong>W. Wu</strong>, D. Wang, M. Lv, J. Jiang, L. Liu, and Z. Peng, “<a href="https://ieeexplore.ieee.org/abstract/document/9189015">Event-triggered LOS Guidance for Path Following of an Unmanned Surface Vehicle over Wireless Network</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/9181388/proceeding">2020 39th Chinese Control Conference (CCC)</a></em>, IEEE, pp. 4475–4480, 2020. <a href="/assets/papers/EI/2020-CCC.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
  <li data-type="conference" data-year="2020" data-date="2020-04" data-citation-plain="H. Wang, J. Jiang, W. Wu, L. Liu, D. Wang, and Z. Peng, “Robust distributed guidance and control of multiple autonomous surface vehicles based on extended state observers and finite-set model predictive control,” in 2020 5th International Conference on Automation, Control and Robotics Engineering (CACRE), IEEE, pp. 235–239, 2020." data-citation-bibtex="@INPROCEEDINGS{Wang2020Robust,&#10;  author={Wang, Haoliang and Jiang, Jizhou and Wu, Wentao and Liu, Lu and Wang, Dan and Peng, Zhouhua},&#10;  title={Robust distributed guidance and control of multiple autonomous surface vehicles based on extended state observers and finite-set model predictive control},&#10;  booktitle={2020 5th International Conference on Automation, Control and Robotics Engineering (CACRE)},&#10;  organization={IEEE},&#10;  pages={235--239},&#10;  year={2020}&#10;}">
    <p>H. Wang, J. Jiang, <strong>W. Wu</strong>, L. Liu, D. Wang, and Z. Peng, “<a href="https://ieeexplore.ieee.org/abstract/document/9230166">Robust distributed guidance and control of multiple autonomous surface vehicles based on extended state observers and finite-set model predictive control</a>,” in <em class="publication-venue publication-venue--conference"><a href="https://ieeexplore.ieee.org/xpl/conhome/9229471/proceeding">2020 5th International Conference on Automation, Control and Robotics Engineering (CACRE)</a></em>, IEEE, pp. 235–239, 2020. <a href="/assets/papers/EI/WangHaoliang-2020-CACRE.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"/></a></p>
  </li>
</ul>






{% include citation-modal.html %}