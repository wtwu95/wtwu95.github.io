(function () {
  const LANGUAGE_KEY = 'site-language';
  const THEME_KEY = 'site-theme';
  const body = document.body;
  const html = document.documentElement;
  const languageToggle = document.getElementById('language-toggle');
  const languageLabel = document.getElementById('language-toggle-label');
  const themeToggle = document.getElementById('theme-toggle');

  const translations = {
    zh: {
      'nav-home': '主页',
      'nav-biography': '个人简介',
      'nav-news': '最新动态',
      'nav-publications': '代表性论文',
      'nav-awards': '所获荣誉',
      'nav-services': '学术服务',
      'heading-biography': '👨🏻‍🎓 个人简介',
      'bio-paragraph-1': '我目前在<a href="https://www.polyu.edu.hk/rclae/">香港理工大学低空经济研究中心</a>、<a href="https://www.polyu.edu.hk/aae/">航空及民航工程学系</a>担任博士后研究员，由<a href="https://scholar.google.com/citations?user=UfIb9GkAAAAJ">陈文华教授</a>指导。',
      'bio-paragraph-2': '我是<a href="http://www.coscipress.com/journal/JAICS">《人工智能与控制系统期刊》</a>青年编委，同时担任2025年第十届ACIRS第二分会“机器人系统的分布式优化与控制”组织者。2025年入选中国科协“青年人才托举工程博士专项计划”，并于2020、2023、2024年获得研究生国家奖学金，我的硕士论文荣获辽宁省优秀硕士学位论文。',
      'bio-paragraph-3': '我的研究兴趣包括分布式控制、安全关键控制、强化学习、博弈优化及其在自主车辆和多智能体系统中的应用。我已在IEEE T-CYB、IEEE/CAA JAS、IEEE T-ITS、IEEE T-FS、IEEE CDC等国际顶级期刊与会议发表30余篇论文<a href="https://scholar.google.com/citations?user=e2ban1wAAAAJ"> <img src="https://img.shields.io/endpoint?logo=Google%20Scholar&url=https://raw.githubusercontent.com/wtwu95/wtwu95.github.io/google-scholar-stats/gs_data_shieldsio.json&labelColor=f6f6f6&color=9cf&style=flat&label=citations" alt="Google Scholar 引用数"></a>。',
      'bio-paragraph-4': '欢迎与我交流科研合作事宜，可通过邮箱 <a href="mailto:wtwu95@gmail.com">wtwu95@gmail.com</a> 或 <a href="mailto:wen-tao.wu@polyu.edu.hk">wen-tao.wu@polyu.edu.hk</a> 与我联系。',
      'heading-experiences': '📖 工作与访学经历',
      'experience-postdoc': '\n    <div class="cv-row">\n      <div class="cv-main">\n        <span class="cv-role">博士后研究员</span>，就职于\n        <a href="https://www.polyu.edu.hk/rclae/">香港理工大学低空经济研究中心 (RCLAE)</a>、\n        <a href="https://www.polyu.edu.hk/aae/">航空及民航工程学系 (AAE)</a>，\n        <a href="https://www.polyu.edu.hk/">香港理工大学 (PolyU)</a>，香港，中国\n      </div>\n      <div class="cv-date">2025/04–至今</div>\n    </div>\n    <div class="cv-sub">导师：<a href="https://scholar.google.com/citations?user=UfIb9GkAAAAJ"><b>陈文华</b></a>教授（IEEE、IMechE、IET、HEA 会士）</div>\n  ',
      'experience-visiting': '\n    <div class="cv-row">\n      <div class="cv-main">\n        <span class="cv-role">访问学者</span>，在\n        <a href="https://www.uvic.ca/ecs/mechanical/prospective-students/undergraduate/index.php">维多利亚大学机械工程系 (ME)</a>，\n        <a href="https://www.uvic.ca/">维多利亚大学 (UVic)</a>，加拿大维多利亚\n      </div>\n      <div class="cv-date">2024/01–2024/11</div>\n    </div>\n    <div class="cv-sub">导师：<a href="https://scholar.google.com/citations?user=LVnHobEAAAAJ"><b>施阳</b></a>教授（RSC、CAE、EIC、IEEE、ASME、CSME 会士）</div>\n  ',
      'heading-educations': '🎓 教育背景',
      'education-phd': '\n    <div class="cv-row">\n      <div class="cv-main">\n        <span class="cv-degree">博士 (Ph.D.)</span>，电子信息工程，\n        <a href="https://sais.sjtu.edu.cn/">上海交通大学自动化与人工智能研究院</a>（<a href="https://automation.sjtu.edu.cn/">自动化系</a>）、<a href="https://www.sjtu.edu.cn/">上海交通大学 (SJTU)</a>，中国上海\n      </div>\n      <div class="cv-date">2021/09–2025/03</div>\n    </div>\n    <div class="cv-sub">导师：<a href="https://automation.sjtu.edu.cn/wdzhang"><b>张卫东</b></a>教授、<a href="https://automation.sjtu.edu.cn/Jun-Guo"><b>卢俊国</b></a>教授</div>\n  ',
      'education-master': '\n    <div class="cv-row">\n      <div class="cv-main">\n        <span class="cv-degree">硕士 (M.E.)</span>，电气工程，\n        <a href="https://cbdq.dlmu.edu.cn/index.htm">大连海事大学海洋电气工程学院</a>、<a href="https://www.dlmu.edu.cn/">大连海事大学 (DMU)</a>，中国大连\n      </div>\n      <div class="cv-date">2018/09–2021/06</div>\n    </div>\n    <div class="cv-sub">导师：<a href="https://scholar.google.com/citations?user=kc8gnlMAAAAJ"><b>王丹</b></a>教授、<a href="https://scholar.google.com/citations?user=hM_5JDYAAAAJ"><b>彭周华</b></a>教授</div>\n  ',
      'education-bachelor': '\n    <div class="cv-row">\n      <div class="cv-main">\n        <span class="cv-degree">学士 (B.E.)</span>，电气工程及其自动化，\n        <a href="https://www.seiee.sjtu.edu.cn/">电气与电子工程学院</a>、<a href="http://www.hrbust.edu.cn/">哈尔滨理工大学 (HUST)</a>，中国哈尔滨\n      </div>\n      <div class="cv-date">2014/09–2018/06</div>\n    </div>\n  ',
      'heading-news': '💬 最新动态',
      'news-empty': '暂无新闻更新，欢迎稍后再来查看。',
      'news-read-more': '查看更多新闻',
      'heading-publications': '📚 代表性论文',
      'publications-show-all': '查看全部论文',
      'heading-awards': '🎖 所获荣誉',
      'award-2025': '2025 年：**<span style="color:red">青年人才托举工程博士专项计划（首批）</span>**',
      'award-2024': '2024 · 2023 · 2020 年：**<span style="color:red">研究生国家奖学金</span>**',
      'award-2023-best-paper': '2023 年：第七届CCSICC **<span style="color:red">最佳学生论文提名奖</span>**',
      'award-2022': '2022 年：**<span style="color:red">辽宁省优秀硕士学位论文奖</span>**',
      'awards-view-all': '查看全部奖项',
      'heading-services': '⚙️ 学术服务',
      'service-editor': '**青年编委**：<a href="http://www.coscipress.com/journal/JAICS">Journal of Artificial Intelligence &amp; Control Systems</a>（2025 至今）',
      'service-organizer': '**会议组织者**：2025 第十届 ACIRS “机器人系统的分布式优化与控制”专题',
      'service-ta': '**课程助教**：香港理工大学《动力系统与控制》（2025 年 9 月至今）',
      'service-reviewer': '**审稿人**：多家国际期刊与会议',
      'services-view-all': '查看全部服务',
      'heading-misc': '😀 其他资源'
    }
  };

  const elementsByKey = {};

  function captureElements() {
    Object.keys(elementsByKey).forEach((key) => {
      elementsByKey[key] = [];
    });

    document.querySelectorAll('[data-i18n-key]').forEach((element) => {
      const key = element.getAttribute('data-i18n-key');
      if (!key) {
        return;
      }
      if (!elementsByKey[key]) {
        elementsByKey[key] = [];
      }
      elementsByKey[key].push(element);
      if (!element.dataset.i18nEn) {
        element.dataset.i18nEn = element.innerHTML;
      }
    });
  }

  function applyLanguage(lang) {
    const target = lang === 'zh' ? 'zh' : 'en';
    body.setAttribute('data-language', target);
    html.setAttribute('lang', target === 'zh' ? 'zh-Hans' : 'en');

    Object.keys(elementsByKey).forEach((key) => {
      const elements = elementsByKey[key];
      const translation = translations.zh[key];
      elements.forEach((element) => {
        if (!element.dataset.i18nEn) {
          element.dataset.i18nEn = element.innerHTML;
        }
        if (target === 'zh' && translation) {
          element.innerHTML = translation;
        } else {
          element.innerHTML = element.dataset.i18nEn;
        }
      });
    });

    if (languageLabel) {
      languageLabel.textContent = target === 'zh' ? 'EN' : '中文';
    }

    if (languageToggle) {
      languageToggle.setAttribute('aria-pressed', target === 'zh');
    }

    try {
      localStorage.setItem(LANGUAGE_KEY, target);
    } catch (error) {
      /* localStorage might be unavailable */
    }
  }

  function applyTheme(theme) {
    const mode = theme === 'dark' ? 'dark' : 'light';
    body.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      body.classList.add('theme-dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', 'true');
      }
    } else {
      body.classList.remove('theme-dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', 'false');
      }
    }
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      /* localStorage might be unavailable */
    }
  }

  function initialLanguage() {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === 'zh' || stored === 'en') {
        return stored;
      }
    } catch (error) {
      /* ignore */
    }
    return 'en';
  }

  function initialTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (error) {
      /* ignore */
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    captureElements();
    applyLanguage(initialLanguage());
    applyTheme(initialTheme());

    if (languageToggle) {
      languageToggle.addEventListener('click', function () {
        const current = body.getAttribute('data-language') === 'zh' ? 'zh' : 'en';
        const next = current === 'zh' ? 'en' : 'zh';
        applyLanguage(next);
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const next = body.classList.contains('theme-dark') ? 'light' : 'dark';
        applyTheme(next);
      });
    }
  });
})();
