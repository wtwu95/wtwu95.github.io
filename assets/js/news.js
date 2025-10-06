(function () {
  function parseLimit(value, fallback) {
    var number = Number.parseInt(value, 10);
    if (Number.isNaN(number)) {
      return fallback;
    }
    return number < 0 ? 0 : number;
  }

  function getTagsFromDataset(dataset) {
    var tags = dataset.tags || '';
    if (!tags) {
      return [];
    }
    return tags
      .split(/\s+/)
      .map(function (tag) {
        return tag.trim();
      })
      .filter(function (tag) {
        return tag.length > 0;
      });
  }

  function initNewsWidget(widget) {
    if (!widget) {
      return;
    }

    var list = widget.querySelector('[data-news-list]');
    if (!list) {
      return;
    }

    var items = Array.prototype.slice.call(list.querySelectorAll('[data-news-item]'));
    if (!items.length) {
      return;
    }

    var limit = parseLimit(widget.getAttribute('data-initial-limit'), items.length);
    var totalCount = parseLimit(widget.getAttribute('data-total-count'), items.length);
    if (!Number.isFinite(limit) || limit > totalCount) {
      limit = totalCount;
    }

    var filterState = {};
    var expandAll = false;
    var expandButton = widget.querySelector('[data-action="expand-news"]');
    var emptyMessage = widget.querySelector('[data-news-empty]');

    function matchesFilters(item) {
      var matches = true;
      Object.keys(filterState).forEach(function (key) {
        if (!matches) {
          return;
        }
        var value = filterState[key];
        if (!value) {
          return;
        }

        if (key === 'tag') {
          var tags = getTagsFromDataset(item.dataset);
          matches = tags.indexOf(value) !== -1;
          return;
        }

        if (key === 'year') {
          matches = (item.getAttribute('data-year') || '') === value;
          return;
        }
      });
      return matches;
    }

    function applyFilters() {
      var effectiveLimit = expandAll ? Number.POSITIVE_INFINITY : limit;
      var matchedCount = 0;
      var shownCount = 0;

      items.forEach(function (item) {
        var shouldDisplay = matchesFilters(item);
        if (!shouldDisplay) {
          item.hidden = true;
          return;
        }

        matchedCount += 1;

        if (!expandAll && effectiveLimit === 0) {
          item.hidden = true;
          return;
        }

        if (!expandAll && shownCount >= effectiveLimit) {
          item.hidden = true;
          return;
        }

        item.hidden = false;
        shownCount += 1;
      });

      if (emptyMessage) {
        emptyMessage.hidden = matchedCount !== 0;
      }

      if (expandButton) {
        var hasMoreToShow = !expandAll && matchedCount > shownCount;
        expandButton.hidden = !hasMoreToShow;
        expandButton.setAttribute('aria-expanded', expandAll ? 'true' : 'false');
      }
    }

    function resetExpand() {
      expandAll = false;
      applyFilters();
    }

    if (expandButton) {
      expandButton.addEventListener('click', function () {
        expandAll = true;
        applyFilters();
      });
    }

    var filterGroups = widget.querySelectorAll('[data-filter-group]');
    Array.prototype.forEach.call(filterGroups, function (group) {
      var groupName = group.getAttribute('data-filter-group');
      if (!groupName) {
        return;
      }

      var buttons = group.querySelectorAll('[data-filter-button]');
      var activeButton = group.querySelector('[data-filter-button].is-active');
      var activeValue = activeButton ? activeButton.getAttribute('data-filter-value') || '' : '';

      filterState[groupName] = activeValue;

      Array.prototype.forEach.call(buttons, function (button) {
        button.addEventListener('click', function () {
          if (button.classList.contains('is-active')) {
            return;
          }

          Array.prototype.forEach.call(buttons, function (otherButton) {
            otherButton.classList.remove('is-active');
            otherButton.setAttribute('aria-pressed', 'false');
          });

          button.classList.add('is-active');
          button.setAttribute('aria-pressed', 'true');

          var value = button.getAttribute('data-filter-value') || '';
          filterState[groupName] = value;
          resetExpand();
        });
      });
    });

    applyFilters();
  }

  function init() {
    var widgets = document.querySelectorAll('[data-news-widget]');
    Array.prototype.forEach.call(widgets, initNewsWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
