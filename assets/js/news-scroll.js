(function () {
  'use strict';

  var DEFAULT_VISIBLE_ITEMS = 10;
  var resizeTimer;
  var windows = [];

  function toNumber(value) {
    var parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  function setMaxHeight(state) {
    var wrapper = state.wrapper;
    var items = state.items;
    var visibleCount = state.visibleCount;

    if (!wrapper) {
      return;
    }

    if (state.expanded || items.length <= visibleCount) {
      wrapper.style.maxHeight = '';
      return;
    }

    var total = 0;
    var counted = 0;

    for (var i = 0; i < items.length && counted < visibleCount; i += 1) {
      var item = items[i];

      if (!item || item.classList.contains('is-hidden')) {
        continue;
      }

      var styles = window.getComputedStyle(item);
      total += item.offsetHeight + toNumber(styles.marginTop) + toNumber(styles.marginBottom);
      counted += 1;
    }

      if (!counted) {
      wrapper.style.maxHeight = '';
      return;
    }

    wrapper.style.maxHeight = Math.ceil(total) + 'px';
  }

  function expand(state) {
    if (state.expanded) {
      return;
    }

    state.expanded = true;

    for (var i = state.visibleCount; i < state.items.length; i += 1) {
      state.items[i].classList.remove('is-hidden');
    }

    if (state.wrapper) {
      state.wrapper.style.maxHeight = '';
    }

    if (state.toggle) {
      state.toggle.setAttribute('aria-expanded', 'true');
      state.toggle.classList.add('is-hidden');
      state.toggle.setAttribute('aria-hidden', 'true');
    }
  }

  function initialize(windowEl) {
    var wrapper = windowEl.querySelector('.news-scroll');
    var list = wrapper ? wrapper.querySelector('.news-list') : null;

    if (!wrapper || !list) {
      return;
    }

    var toggle = windowEl.querySelector('[data-news-toggle]');
    var visibleAttr = windowEl.getAttribute('data-news-visible');
    var visibleCount = parseInt(visibleAttr, 10);

    if (!visibleCount || visibleCount < 1) {
      visibleCount = DEFAULT_VISIBLE_ITEMS;
    }

    var items = Array.prototype.slice.call(list.querySelectorAll('.news-item'));

    if (!items.length) {
      if (toggle) {
        toggle.classList.add('is-hidden');
        toggle.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    if (items.length <= visibleCount) {
      wrapper.style.maxHeight = '';
      if (toggle) {
        toggle.classList.add('is-hidden');
        toggle.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    for (var i = visibleCount; i < items.length; i += 1) {
      items[i].classList.add('is-hidden');
    }

    var state = {
      wrapper: wrapper,
      items: items,
      toggle: toggle,
      visibleCount: visibleCount,
      expanded: false,
    };

    setMaxHeight(state);

    if (toggle) {
      toggle.classList.remove('is-hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-hidden', 'false');
      toggle.addEventListener('click', function () {
        expand(state);
      });
    }

    windows.push(state);
  }

  function updateAll() {
    windows.forEach(function (state) {
      if (!state.expanded) {
        setMaxHeight(state);
      }
    });
  }

  function init() {
    var allWindows = document.querySelectorAll('[data-news-window]');
    windows = [];

    Array.prototype.forEach.call(allWindows, function (windowEl) {
      initialize(windowEl);
    });

    updateAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateAll, 150);
  });
})();
