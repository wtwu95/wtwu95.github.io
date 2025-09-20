(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var sourceList = document.querySelector('#publication-source');
    var listEl = document.querySelector('#publication-list');
    var typeSelect = document.querySelector('#publication-type-filter');
    var yearSelect = document.querySelector('#publication-year-filter');
    var sortButton = document.querySelector('#publication-year-sort');

    if (!sourceList || !listEl || !typeSelect || !yearSelect || !sortButton) {
      return;
    }

    var typeLabels = {
      journal: 'Journal article',
      conference: 'Conference paper',
      patent: 'Patent',
      review: 'Review'
    };

    var publications = Array.prototype.slice.call(sourceList.querySelectorAll('li')).map(function (item) {
      var year = parseInt(item.getAttribute('data-year'), 10);
      return {
        type: item.getAttribute('data-type') || 'other',
        year: isNaN(year) ? null : year,
        date: item.getAttribute('data-date') || '',
        content: item.innerHTML.trim()
      };
    });

    var uniqueTypes = Array.from(new Set(publications.map(function (pub) {
      return pub.type;
    }).filter(Boolean)));

    uniqueTypes.sort(function (a, b) {
      var labelA = typeLabels[a] || a;
      var labelB = typeLabels[b] || b;
      return labelA.localeCompare(labelB, 'zh-Hans-CN');
    });

    typeSelect.innerHTML = '<option value="all">Type</option>' + uniqueTypes.map(function (type) {
      var label = typeLabels[type] || type;
      return '<option value="' + type + '">' + label + '</option>';
    }).join('');

    function updateYearOptions() {
      var years = Array.from(new Set(publications.map(function (pub) {
        return pub.year;
      }).filter(Boolean)));
      years.sort(function (a, b) { return b - a; });
      yearSelect.innerHTML = '<option value="all">Date</option>' + years.map(function (year) {
        return '<option value="' + year + '">' + year + '</option>';
      }).join('');
    }

    updateYearOptions();

    var sortOrder = 'desc';

    function normalizeDate(dateStr, year) {
      if (!dateStr) {
        return year ? String(year) + '-01-01' : '0000-01-01';
      }
      var normalized = dateStr.trim();
      if (/^\d{4}$/.test(normalized)) {
        return normalized + '-12-31';
      }
      if (/^\d{4}-\d{2}$/.test(normalized)) {
        return normalized + '-01';
      }
      if (/^\d{4}\/\d{2}/.test(normalized)) {
        var parts = normalized.split('/');
        return parts[0] + '-' + parts[1] + '-01';
      }
      return normalized;
    }

    function render() {
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;

      var filtered = publications.filter(function (pub) {
        if (selectedType !== 'all' && pub.type !== selectedType) {
          return false;
        }
        if (selectedYear !== 'all' && String(pub.year) !== selectedYear) {
          return false;
        }
        return true;
      });

      filtered.sort(function (a, b) {
        var dateA = normalizeDate(a.date, a.year);
        var dateB = normalizeDate(b.date, b.year);
        if (dateA === dateB) {
          return 0;
        }
        if (sortOrder === 'desc') {
          return dateA > dateB ? -1 : 1;
        }
        return dateA > dateB ? 1 : -1;
      });

      listEl.innerHTML = '';

      if (filtered.length === 0) {
        var emptyItem = document.createElement('li');
        emptyItem.className = 'publication-empty';
        emptyItem.textContent = 'No matching publication';
        listEl.appendChild(emptyItem);
        return;
      }

      var total = filtered.length;
      filtered.forEach(function (pub, index) {
        var li = document.createElement('li');
        var number = sortOrder === 'desc' ? total - index : index + 1;
        li.innerHTML = '<span class="publication-index">[' + number + ']</span>' + pub.content;
        listEl.appendChild(li);
      });
    }

    typeSelect.addEventListener('change', render);
    yearSelect.addEventListener('change', render);
    sortButton.addEventListener('click', function () {
      sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      sortButton.textContent = sortOrder === 'desc' ? 'Year ↓' : 'Year ↑';
      render();
    });

    render();
  });
})();
