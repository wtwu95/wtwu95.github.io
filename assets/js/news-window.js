(function () {
  'use strict';

  function parseVisibleCount(value, fallback) {
    var parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 1 ? fallback : parsed;
  }

  function computeVisibleHeight(items, count) {
    var total = 0;

    for (var index = 0; index < count && index < items.length; index += 1) {
      var item = items[index];
      var styles = window.getComputedStyle(item);
      var marginTop = parseFloat(styles.marginTop || 0);
      var marginBottom = parseFloat(styles.marginBottom || 0);

      total += item.offsetHeight + marginTop + marginBottom;
    }

    return Math.ceil(total);
  }

  function enhance(container) {
    if (!container) {
      return;
    }

    var list = container.querySelector('.news-list');
    if (!list) {
      return;
    }

    var items = list.querySelectorAll('li');
    if (!items.length) {
      return;
    }

    var visibleCount = parseVisibleCount(container.getAttribute('data-visible-count'), 5);

    if (items.length <= visibleCount) {
      container.classList.remove('news-window--scroll');
      container.style.removeProperty('--news-window-max-height');
      return;
    }

    var height = computeVisibleHeight(items, visibleCount);
    if (height > 0) {
      container.style.setProperty('--news-window-max-height', height + 'px');
    }

    container.classList.add('news-window--scroll');

    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '0');
    }
  }

  function init() {
    var containers = document.querySelectorAll('[data-news-window]');

    if (!containers || !containers.length) {
      return;
    }

    for (var i = 0; i < containers.length; i += 1) {
      enhance(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('news:data-updated', function () {
    init();
  });
})();
