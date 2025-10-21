---
permalink: /academic-card/
title: "Academic Card"
excerpt: "A bilingual academic calling card for Wentao Wu."
author_profile: true
---

{% assign homepage_url = site.url | default: site.github.url | default: 'https://wtwu95.github.io' %}
{% assign card_url = homepage_url | append: page.permalink %}

<div class="academic-card-page" data-lang-wrapper>
  <div class="academic-card" aria-labelledby="academic-card-heading">
    <div class="academic-card__header">
      <div class="academic-card__identity">
        <img class="academic-card__avatar" src="{{ site.author.avatar | relative_url }}" alt="Portrait of {{ site.author.name }}">
        <div class="academic-card__title-group">
          <h1 id="academic-card-heading">
            <span data-lang="en">{{ site.author.name }}</span>
            <span data-lang="zh" hidden>{{ site.author.name_zh }}</span>
          </h1>
          <p class="academic-card__tagline">
            <span data-lang="en">{{ site.author.bio }}</span>
            <span data-lang="zh" hidden>{{ site.author.bio_zh }}</span>
          </p>
          <p class="academic-card__institution">
            <span data-lang="en">{{ site.author.employer }}</span>
            <span data-lang="zh" hidden>{{ site.author.employer_zh }}</span>
          </p>
        </div>
      </div>
      <div class="academic-card__qr">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&amp;data={{ card_url | uri_escape }}" alt="QR code linking to {{ card_url }}">
        <p class="academic-card__qr-caption">
          <span data-lang="en">Scan for full profile</span>
          <span data-lang="zh" hidden>扫码查看主页</span>
        </p>
      </div>
    </div>

    <div class="academic-card__content">
      <section class="academic-card__section">
        <h2>
          <span data-lang="en">Research Focus</span>
          <span data-lang="zh" hidden>研究方向</span>
        </h2>
        <ul class="academic-card__list">
          <li>
            <span data-lang="en">Distributed and cooperative control for autonomous vehicles</span>
            <span data-lang="zh" hidden>自主系统的分布式协同控制</span>
          </li>
          <li>
            <span data-lang="en">Safety-critical and resilient decision-making</span>
            <span data-lang="zh" hidden>安全关键与鲁棒决策</span>
          </li>
          <li>
            <span data-lang="en">Learning-enabled control and game-theoretic optimization</span>
            <span data-lang="zh" hidden>强化学习控制与博弈优化</span>
          </li>
        </ul>
      </section>

      <section class="academic-card__section">
        <h2>
          <span data-lang="en">Highlights</span>
          <span data-lang="zh" hidden>学术亮点</span>
        </h2>
        <div class="academic-card__highlights">
          <article class="academic-card__highlight">
            <h3>30+</h3>
            <p>
              <span data-lang="en">Publications across IEEE T-CYB, IEEE/CAA JAS, IEEE T-ITS, IEEE T-FS, CDC, and IROS</span>
              <span data-lang="zh" hidden>在 IEEE T-CYB、IEEE/CAA JAS、IEEE T-ITS、IEEE T-FS、CDC、IROS 等期刊会议发表论文 30 余篇</span>
            </p>
          </article>
          <article class="academic-card__highlight">
            <h3>
              <span data-lang="en">Young Elite Scientist Sponsorship</span>
              <span data-lang="zh" hidden>科协青年托举工程博士专项</span>
            </h3>
            <p>
              <span data-lang="en">Inaugural CAST Doctoral Special Program awardee (2025)</span>
              <span data-lang="zh" hidden>2025 年首届中国科协青年人才托举工程博士专项计划入选者</span>
            </p>
          </article>
          <article class="academic-card__highlight">
            <h3>
              <span data-lang="en">National Scholarships ×3</span>
              <span data-lang="zh" hidden>国家奖学金 ×3</span>
            </h3>
            <p>
              <span data-lang="en">Recognized for graduate excellence in 2020, 2023, and 2024</span>
              <span data-lang="zh" hidden>2020、2023、2024 年研究生国家奖学金获得者</span>
            </p>
          </article>
        </div>
      </section>

      <section class="academic-card__section">
        <h2>
          <span data-lang="en">Connect</span>
          <span data-lang="zh" hidden>联系方式</span>
        </h2>
        <dl class="academic-card__contacts">
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:wtwu95@gmail.com">wtwu95@gmail.com</a>
              <span aria-hidden="true"> · </span>
              <a href="mailto:wen-tao.wu@polyu.edu.hk">wen-tao.wu@polyu.edu.hk</a>
            </dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd><a href="https://www.linkedin.com/in/{{ site.author.linkedin }}" rel="noopener">linkedin.com/in/{{ site.author.linkedin }}</a></dd>
          </div>
          <div>
            <dt>Google Scholar</dt>
            <dd><a href="{{ site.author.googlescholar }}" rel="noopener">scholar.google.com/citations?user=e2ban1wAAAAJ</a></dd>
          </div>
          <div>
            <dt>ResearchGate</dt>
            <dd><a href="{{ site.author.researchgate }}" rel="noopener">researchgate.net/profile/Wu-Wentao-5</a></dd>
          </div>
        </dl>
      </section>

      <section class="academic-card__section">
        <h2>
          <span data-lang="en">Collaboration Opportunities</span>
          <span data-lang="zh" hidden>合作机会</span>
        </h2>
        <p class="academic-card__collaboration">
          <span data-lang="en">I am actively seeking collaborations on resilient autonomy for aerial, marine, and ground vehicles. Let's co-develop intelligent mobility solutions for complex environments.</span>
          <span data-lang="zh" hidden>期待在空海地自主系统的鲁棒智能控制与协同优化方面开展合作，共同探索复杂环境下的智能移动解决方案。</span>
        </p>
      </section>
    </div>

    <footer class="academic-card__footer">
      <button type="button" class="btn btn--primary academic-card__action" onclick="window.print()">
        <span data-lang="en">Download / Print Card</span>
        <span data-lang="zh" hidden>下载 / 打印名片</span>
      </button>
      <p class="academic-card__location">
        <span data-lang="en">Based in {{ site.author.location }}</span>
        <span data-lang="zh" hidden>常驻 {{ site.author.location_zh }}</span>
      </p>
    </footer>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.querySelector('[data-lang-wrapper]');
    if (!wrapper) return;
    wrapper.addEventListener('languagechange', function (event) {
      if (!event.detail || !event.detail.lang) return;
      var lang = event.detail.lang;
      wrapper.querySelectorAll('[data-lang]').forEach(function (node) {
        var nodeLang = node.getAttribute('data-lang');
        var shouldShow = nodeLang === lang;
        node.hidden = !shouldShow;
      });
    });
  });
</script>
