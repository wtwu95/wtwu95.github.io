(function () {
  const STORAGE_KEYS = {
    theme: 'site-theme-preference',
    language: 'site-language-preference',
  };

  const META_THEME_COLORS = {
    light: '#ffffff',
    dark: '#0f172a',
  };

  const html = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]#site-theme-color');
  const themeToggles = Array.from(document.querySelectorAll('[data-theme-toggle]'));
  const languageToggles = Array.from(document.querySelectorAll('[data-language-toggle]'));

  function getActiveLanguage() {
    return html.getAttribute('data-language') === 'zh' ? 'zh' : 'en';
  }

  function getThemeAriaLabel(isDark, language) {
    if (language === 'zh') {
      return isDark ? '切换到浅色模式' : '切换到深色模式';
    }

    return isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function updateMetaThemeColor(theme) {
    if (!metaTheme) {
      return;
    }

    const color = META_THEME_COLORS[theme] || META_THEME_COLORS.light;
    metaTheme.setAttribute('content', color);
  }

  function applyTheme(theme, options) {
    const settings = Object.assign({ persist: true }, options);
    const normalized = theme === 'dark' ? 'dark' : 'light';

    html.classList.toggle('theme-dark', normalized === 'dark');
    html.classList.toggle('theme-light', normalized !== 'dark');
    html.setAttribute('data-theme', normalized);

    const isDark = normalized === 'dark';
    const language = getActiveLanguage();

    themeToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', getThemeAriaLabel(isDark, language));
    });

    updateMetaThemeColor(normalized);

    if (settings.persist) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.theme, normalized);
      } catch (error) {
        /* localStorage may be unavailable */
      }
    }
  }

  function applyLanguage(language, options) {
    const settings = Object.assign({ persist: true }, options);
    const normalized = language === 'zh' ? 'zh' : 'en';
    const nextLanguage = normalized === 'zh' ? 'en' : 'zh';

    html.setAttribute('data-language', normalized);
    html.setAttribute('lang', normalized);

    document.querySelectorAll('[data-lang]').forEach(function (node) {
      const nodeLang = node.getAttribute('data-lang');
      const shouldShow = nodeLang === normalized;

      if (shouldShow) {
        node.removeAttribute('hidden');
      } else if (!node.hasAttribute('data-lang-persistent')) {
        node.setAttribute('hidden', '');
      } else {
        node.hidden = true;
      }
    });

    document.querySelectorAll('[data-placeholder-en]').forEach(function (input) {
      const placeholder = normalized === 'zh'
        ? input.getAttribute('data-placeholder-zh')
        : input.getAttribute('data-placeholder-en');
      if (placeholder) {
        input.setAttribute('placeholder', placeholder);
      }

      const ariaLabel = normalized === 'zh'
        ? input.getAttribute('data-aria-label-zh')
        : input.getAttribute('data-aria-label-en');
      if (ariaLabel) {
        input.setAttribute('aria-label', ariaLabel);
      }
    });

    document.querySelectorAll('select[data-label-en]').forEach(function (select) {
      const label = normalized === 'zh'
        ? select.getAttribute('data-label-zh')
        : select.getAttribute('data-label-en');
      if (label) {
        if (select.options.length > 0) {
          select.options[0].textContent = label;
        }
        select.setAttribute('aria-label', label);
      }
    });

    document.querySelectorAll('[data-aria-label-en]').forEach(function (element) {
      const ariaLabel = normalized === 'zh'
        ? element.getAttribute('data-aria-label-zh')
        : element.getAttribute('data-aria-label-en');
      if (ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
      }
    });

    const isChinese = normalized === 'zh';

    languageToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-pressed', String(isChinese));
      toggle.setAttribute(
        'aria-label',
        isChinese ? '切换到英文' : 'Switch to Chinese'
      );

      toggle.dataset.nextLanguage = nextLanguage;
    });

    applyTheme(html.getAttribute('data-theme') || 'light', { persist: false });

    if (settings.persist) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.language, normalized);
      } catch (error) {
        /* localStorage may be unavailable */
      }
    }
  }

  function resolveStoredPreference(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  const storedTheme = resolveStoredPreference(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const initialTheme = storedTheme || (prefersDark && prefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme, { persist: Boolean(storedTheme) });

  if (prefersDark && typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', function (event) {
      if (!resolveStoredPreference(STORAGE_KEYS.theme)) {
        applyTheme(event.matches ? 'dark' : 'light', { persist: false });
      }
    });
  }

  const storedLanguage = resolveStoredPreference(STORAGE_KEYS.language);
  const initialLanguage = storedLanguage || html.getAttribute('lang') || 'en';
  applyLanguage(initialLanguage, { persist: Boolean(storedLanguage) });

  themeToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  languageToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const currentLanguage = html.getAttribute('data-language') === 'zh' ? 'zh' : 'en';
      const nextLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
      applyLanguage(nextLanguage);
    });
  });
})();
