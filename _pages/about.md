---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<span class='anchor' id='about-me'></span>
<div class="landing landing--home">

<section class="landing-block landing-block--hero">
  <span class="anchor" id="about-me"></span>
  <div class="landing-block__inner">
    <div class="landing-block__primary">
      <p class="landing-eyebrow">Safety-Critical Control · Autonomous Systems · Marine Robotics</p>
      <h1 class="landing-block__title">{{ site.author.name }}</h1>
      <p class="landing-block__subtitle">{{ site.author.bio }}</p>
      <p class="landing-block__summary">Currently with the Research Centre for Low Altitude Economy and the Department of Aeronautical and Aviation Engineering at The Hong Kong Polytechnic University.</p>
      <div class="landing-block__cta">
        <a class="btn btn--large" href="/publications/">📄 View Publications</a>
        <a class="btn btn--inverse btn--large" href="mailto:wtwu95@gmail.com">✉️ Get in touch</a>
      </div>
    </div>
    <div class="landing-block__secondary">
      <div class="landing-stat-panel">
        <h2 class="landing-stat-panel__title">Highlights</h2>
        <ul class="landing-stat-list">
          <li class="landing-stat">
            <span class="landing-stat__label">Research interests</span>
            <span class="landing-stat__value">Distributed &amp; safety-critical control, reinforcement learning, multi-agent systems</span>
          </li>
          <li class="landing-stat">
            <span class="landing-stat__label">Recognition</span>
            <span class="landing-stat__value">Doctoral Special Program of Young Elite Scientist Sponsorship Program · Outstanding Graduates of Shanghai 2025</span>
          </li>
          <li class="landing-stat">
            <span class="landing-stat__label">Outputs</span>
            <span class="landing-stat__value">30+ publications across IEEE T-CYB, IEEE/CAA JAS, IEEE T-ITS, IEEE T-FS, IEEE CDC</span>
          </li>
        </ul>
      </div>
      <div class="landing-quick-links" aria-label="Section shortcuts">
        <a class="landing-quick-link" href="#about-me">About</a>
        <a class="landing-quick-link" href="#news">News</a>
        <a class="landing-quick-link" href="/awards/">Awards</a>
        <a class="landing-quick-link" href="/services/">Professional Services</a>
      </div>
    </div>
  </div>
</section>

<section class="landing-block landing-block--content" markdown="1">
  {% include_relative includes/intro.md %}
</section>

<section class="landing-block landing-block--grid">
  <div class="landing-grid landing-grid--two">
    <div class="landing-card" markdown="1">
      {% include_relative includes/exp.md %}
    </div>
    <div class="landing-card landing-card--accent" markdown="1">
      {% include_relative includes/edu.md %}
    </div>
  </div>
</section>

<section class="landing-block landing-block--grid landing-block--news" id="news">
  <div class="landing-grid landing-grid--two">
    <div class="landing-card landing-card--stretch" markdown="1">
      {% include_relative includes/news.md %}
    </div>
    <aside class="landing-card landing-card--highlight landing-card--stretch" markdown="1">
      <h2 class="landing-card__title">Stay connected</h2>
      <p class="landing-card__lead">Follow the latest updates and explore external profiles.</p>
      {% include_relative includes/homepage.md %}
      <ul class="landing-link-list">
        <li><a href="/publications/">Publication archive</a></li>
        <li><a href="/awards/">Awards &amp; honors</a></li>
        <li><a href="/services/">Professional services</a></li>
      </ul>
    </aside>
  </div>
</section>

<section class="landing-block landing-block--papers" markdown="1">
  <span class="anchor" id="-publications"></span>
  # 📚 Selected Publications

  Explore the full list of publications on the [Publications](/publications/) page.

  <div class='paper-box'><div class='paper-box-image'><div><div class="badge">IEEE CAA/JAS 2024</div><img src='{{ '/assets/Video/Video-Sim/WuWentao-2023-IEEE-JAS.gif' | relative_url }}' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">

  [Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance](/assets/papers/SCI/WuWentao-2023-IEEE-JAS.pdf)<br />
  **W. Wu**, D. Wu, Y. Zhang, S. Chen, and W. Zhang<br />
  [**IEEE/CAA Journal of Automatica Sinica**](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570650)<br />
  <div class="publication-actions">
    <button type="button" class="publication-cite" data-citation-modal-trigger="" data-citation-index="1" data-citation-plain="W. Wu, D. Wu, Y. Zhang, S. Chen, and W. Zhang, “Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance,” IEEE/CAA Journal of Automatica Sinica, vol. 11, no. 9, pp. 2033–2035, Sept. 2024." data-citation-bibtex="@ARTICLE{Wu2024Safety,&#10;  author={Wu, Wentao and Wu, Di and Zhang, Yibo and Chen, Shukang and Zhang, Weidong},&#10;  title={Safety-Critical Trajectory Tracking for Mobile Robots with Guaranteed Performance},&#10;  journal={IEEE/CAA Journal of Automatica Sinica},&#10;  volume={11},&#10;  number={9},&#10;  pages={2033--2035},&#10;  year={2024}&#10;}"><img src="https://img.shields.io/badge/Link-Cite-0969da?labelColor=555" alt="Cite badge"></button>
    <a class="publication-badge" href="/assets/papers/SCI/WuWentao-2023-IEEE-JAS.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"></a>
    <a class="publication-badge" href="/assets/Video/Video-Exp/WuWentao-2023-IEEE-JASa.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Expa--Demo-blue?label=Video"></a>
  </div>
  </div>
  </div>


  <div class='paper-box'><div class='paper-box-image'><div><div class="badge">IEEE TIV 2022</div><img src='{{ '/assets/Video/Video-Sim/WuWentao-2022-IEEE-TIV.gif' | relative_url }}' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">

  [A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train](https://ieeexplore.ieee.org/abstract/document/9762043)<br />
  **W. Wu**, Z. Peng, L. Liu, and D. Wang<br />
  [**IEEE Transactions on Intelligent Vehicles**](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7274857)<br />
  <div class="publication-actions">
    <button type="button" class="publication-cite" data-citation-modal-trigger="" data-citation-index="2" data-citation-plain="W. Wu, Z. Peng, L. Liu, and D. Wang, “A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train,” IEEE Transactions on Intelligent Vehicles, vol. 7, no. 3, pp. 627–637, Sept. 2022." data-citation-bibtex="@ARTICLE{Wu2022Agener,&#10;  author={Wu, Wentao and Peng, Zhouhua and Liu, Lu and Wang, Dan},&#10;  title={A General Safety-Certified Cooperative Control Architecture for Interconnected Intelligent Surface Vehicles with Applications to Vessel Train},&#10;  journal={IEEE Transactions on Intelligent Vehicles},&#10;  volume={7},&#10;  number={3},&#10;  pages={627--637},&#10;  year={2022}&#10;}"><img src="https://img.shields.io/badge/Link-Cite-0969da?labelColor=555" alt="Cite badge"></button>
    <a class="publication-badge" href="/assets/papers/SCI/WuWentao-2022-IEEE-TIV.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"></a>
    <a class="publication-badge" href="/assets/Video/Video-Sim/WuWentao-2022-IEEE-TIV.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"></a>
  </div>
  </div>
  </div>

  <div class='paper-box'><div class='paper-box-image'><div><div class="badge">IEEE T-CYB 2021</div><img src='{{ '/assets/Video/Video-Exp/WuWentao-2021-IEEE-TCYB.png' | relative_url }}' alt="sym" width="100%"></div></div>
  <div class='paper-box-text' markdown="1">

  [Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results](/assets/papers/SCI/WuWentao-2021-IEEE-TCYB.pdf)<br />
  **W. Wu**, Z. Peng, D. Wang, L. Liu, Q.-L. Han<br />
  [**IEEE Transactions on Cybernetics**](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036)<br />
  <div class="publication-actions">
    <button type="button" class="publication-cite" data-citation-modal-trigger="" data-citation-index="3" data-citation-plain="W. Wu, Z. Peng, D. Wang, L. Liu, and Q.-L. Han, “Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results,” IEEE Transactions on Cybernetics, vol. 52, no. 10, pp. 10937–10947, Oct. 2022." data-citation-bibtex="@ARTICLE{Wu2022Networ,&#10;  author={Wu, Wentao and Peng, Zhouhua and Wang, Dan and Liu, Lu and Han, Qing-Long},&#10;  title={Network-Based Line-of-Sight Path Tracking of Underactuated Unmanned Surface Vehicles with Experiment Results},&#10;  journal={IEEE Transactions on Cybernetics},&#10;  volume={52},&#10;  number={10},&#10;  pages={10937--10947},&#10;  year={2022}&#10;}"><img src="https://img.shields.io/badge/Link-Cite-0969da?labelColor=555" alt="Cite badge"></button>
    <a class="publication-badge" href="/assets/papers/SCI/WuWentao-2021-IEEE-TCYB.pdf"><img alt="PDF badge" src="https://img.shields.io/badge/Link-PDF-gree"></a>
    <a class="publication-badge" href="/assets/Video/Video-Sim/WuWentao-2023-IEEE-TSMCA.mp4"><img alt="Video badge" src="https://img.shields.io/badge/%F0%9F%A4%97%20Sim--Demo-blue?label=Video"></a>
  </div>
  </div>
  </div>
  {% include citation-modal.html %}
</section>

<section class="landing-block landing-block--misc" markdown="1">
  # 😀 Miscellaneous

  - [CloudConvert](https://cloudconvert.com/)
  - [iLoveIMG](https://www.iloveimg.com/)
  - [WordClouds](https://www.wordclouds.com/)
  - [Color Hex](https://www.color-hex.com/color-palettes/)
  - [Unsplash](https://unsplash.com/)
  - [Pngtree](https://pngtree.com/)
  - [How to write rebuttals](https://deviparikh.medium.com/how-we-write-rebuttals-dc84742fece1/)
  - [How to write introduction](http://www-net.cs.umass.edu/kurose/writing/intro-style.html)
  - [Emojipedia](https://emojipedia.org/)
</section>

</div>