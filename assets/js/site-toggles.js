(function () {
  const LANGUAGE_KEY = 'site-language';
  const THEME_KEY = 'site-theme';

  function readStoredValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStoredValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* localStorage might be unavailable */
    }
  }

  function initialLanguage() {
    const stored = readStoredValue(LANGUAGE_KEY);
    if (stored === 'zh' || stored === 'en') {
      return stored;
    }
    return 'en';
  }

  function initialTheme() {
    const stored = readStoredValue(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  function toggleLanguageLabel(label, lang) {
    if (!label) {
      return;
    }
    label.textContent = lang === 'zh' ? 'EN' : '中文';
  }

  function toggleThemeIcon(icon, theme) {
    if (!icon) {
      return;
    }
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const html = document.documentElement;
    const languageToggle = document.getElementById('language-toggle');
    const languageLabel = document.getElementById('language-toggle-label');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-toggle-icon');
    const languageElements = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));

    function applyLanguage(lang) {
      const activeLanguage = lang === 'zh' ? 'zh' : 'en';
      body.setAttribute('data-language', activeLanguage);
      html.setAttribute('lang', activeLanguage === 'zh' ? 'zh-Hans' : 'en');

      languageElements.forEach(function (element) {
        if (element.dataset.lang === activeLanguage) {
          element.removeAttribute('hidden');
        } else {
          element.setAttribute('hidden', '');
        }
      });

      toggleLanguageLabel(languageLabel, activeLanguage);

      if (languageToggle) {
        languageToggle.setAttribute('aria-pressed', activeLanguage === 'zh' ? 'true' : 'false');
        var languageTitle = activeLanguage === 'zh' ? '切换到英文' : 'Switch to Chinese';
        languageToggle.setAttribute('aria-label', languageTitle);
        languageToggle.setAttribute('title', languageTitle);
      }

      writeStoredValue(LANGUAGE_KEY, activeLanguage);
    }

    function applyTheme(theme) {
      const activeTheme = theme === 'dark' ? 'dark' : 'light';
      body.setAttribute('data-theme', activeTheme);
      body.classList.toggle('theme-dark', activeTheme === 'dark');

      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', activeTheme === 'dark' ? 'true' : 'false');
        var themeTitle = activeTheme === 'dark' ? 'Switch to light mode / 切换到浅色模式' : 'Switch to dark mode / 切换到深色模式';
        themeToggle.setAttribute('aria-label', themeTitle);
        themeToggle.setAttribute('title', themeTitle);
      }

      toggleThemeIcon(themeIcon, activeTheme);
      writeStoredValue(THEME_KEY, activeTheme);
    }

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

    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      var respondToPreference = function (event) {
        const stored = readStoredValue(THEME_KEY);
        if (stored !== 'dark' && stored !== 'light') {
          applyTheme(event.matches ? 'dark' : 'light');
        }
      };

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', respondToPreference);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(respondToPreference);
      }
    }
  });
})();
