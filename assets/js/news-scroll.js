(function () {
  'use strict';

  var VISIBLE_COUNT = 5;

  function toNumber(value) {
    var parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  function setHeight(wrapper) {
    if (!wrapper) {
      return;
    }

    var items = wrapper.querySelectorAll('li');
    if (!items.length) {
      wrapper.style.maxHeight = '';
      return;
    }

    if (items.length <= VISIBLE_COUNT) {
      wrapper.style.maxHeight = '';
      return;
    }

    var total = 0;
    var count = Math.min(VISIBLE_COUNT, items.length);

    for (var i = 0; i < count; i += 1) {
      var item = items[i];
      var styles = window.getComputedStyle(item);

      total += item.offsetHeight;
      total += toNumber(styles.marginTop) + toNumber(styles.marginBottom);
    }

    wrapper.style.maxHeight = Math.ceil(total) + 'px';
  }

  function updateAll() {
    var wrappers = document.querySelectorAll('.news-scroll');
    Array.prototype.forEach.call(wrappers, function (wrapper) {
      setHeight(wrapper);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAll);
  } else {
    updateAll();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateAll, 150);
  });
})();