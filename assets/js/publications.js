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
    var searchInput = document.querySelector('#publication-search');
    var citationModal = document.querySelector('#citation-modal');
    var citationContent = citationModal ? citationModal.querySelector('#citation-modal-content') : null;
    var citationTabs = citationModal ? Array.prototype.slice.call(citationModal.querySelectorAll('.citation-modal__tab')) : [];
    var citationClose = citationModal ? citationModal.querySelector('.citation-modal__close') : null;
    var citationActions = citationModal ? citationModal.querySelector('.citation-modal__actions') : null;

    if (!sourceList || !listEl || !typeSelect || !yearSelect || !sortButton) {
      return;
    }

    var typeLabels = {
      journal: 'Journal Papers',
      conference: 'Conference Papers',
      review: 'Review Papers',
      preprint: 'Preprints'
    };

    var typeOrder = ['journal', 'conference', 'review', 'preprint'];

    var searchTerm = '';
    var activeCitationFormat = 'gbt';
    var currentCitation = null;

    function sanitizeNode(node) {
      var clone = node.cloneNode(true);
      Array.prototype.slice.call(clone.querySelectorAll('img, template')).forEach(function (el) {
        el.remove();
      });
      return clone;
    }

    function normalizeQuotes(text) {
      if (!text) {
        return '';
      }
      var replaced = text.replace(/''([^']+?)''/g, function (_, title) {
        return '“' + title.trim().replace(/[\s,;:.]+$/, '') + '”';
      });
      replaced = replaced.replace(/"([^"]+?)"/g, function (_, title) {
        return '“' + title.trim().replace(/[\s,;:.]+$/, '') + '”';
      });
      return replaced;
    }

    var publications = Array.prototype.slice.call(sourceList.querySelectorAll('li')).map(function (item) {
      var year = parseInt(item.getAttribute('data-year'), 10);
      var sanitized = sanitizeNode(item);
      var textContent = sanitized.textContent.replace(/\s+/g, ' ').trim();
      var normalizedText = normalizeQuotes(textContent);
      return {
        type: item.getAttribute('data-type') || 'other',
        year: isNaN(year) ? null : year,
        date: item.getAttribute('data-date') || '',
        content: item.innerHTML.trim(),
        rawText: normalizedText,
        searchText: normalizedText.toLowerCase()
      };
    });

    publications = publications.map(function (pub) {
      pub.citations = generateCitations(pub);
      return pub;
    });

    var uniqueTypes = Array.from(new Set(publications.map(function (pub) {
      return pub.type;
    }).filter(Boolean)));

    var orderedOptions = typeOrder.map(function (type) {
      return {
        value: type,
        label: typeLabels[type] || type
      };
    });

    uniqueTypes.forEach(function (type) {
      if (typeOrder.indexOf(type) === -1) {
        orderedOptions.push({
          value: type,
          label: typeLabels[type] || type
        });
      }
    });

    typeSelect.innerHTML = '<option value="all">Type</option>' + orderedOptions.map(function (type) {
      return '<option value="' + type.value + '">' + type.label + '</option>';
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
      var normalizedSearch = searchTerm;

      var filtered = publications.filter(function (pub) {
        if (selectedType !== 'all' && pub.type !== selectedType) {
          return false;
        }
        if (selectedYear !== 'all' && String(pub.year) !== selectedYear) {
          return false;
        }
        if (normalizedSearch && pub.searchText.indexOf(normalizedSearch) === -1) {
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
        li.className = 'publication-item';

        var indexEl = document.createElement('span');
        indexEl.className = 'publication-index';
        indexEl.textContent = '[' + number + ']';

        var bodyEl = document.createElement('div');
        bodyEl.className = 'publication-body';
        bodyEl.innerHTML = pub.content;

        enhanceDisplay(bodyEl);

        if (citationModal && pub.citations) {
          var actions = document.createElement('div');
          actions.className = 'publication-actions';
          var citeButton = document.createElement('button');
          citeButton.type = 'button';
          citeButton.className = 'publication-cite';
          citeButton.textContent = 'Cite';
          citeButton.addEventListener('click', function () {
            openCitation(number, pub.citations);
          });
          actions.appendChild(citeButton);
          bodyEl.appendChild(actions);
        }

        li.appendChild(indexEl);
        li.appendChild(bodyEl);
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

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchTerm = this.value.trim().toLowerCase();
        render();
      });
    }

    function enhanceDisplay(container) {
      Array.prototype.slice.call(container.querySelectorAll('p')).forEach(function (p) {
        p.innerHTML = p.innerHTML.replace(/''([^']+?)''/g, function (_, title) {
          var trimmed = title.trim();
          var match = trimmed.match(/([,;:.])$/);
          if (match) {
            trimmed = trimmed.slice(0, -1);
          }
          return '“' + trimmed + '.”';
        });
      });
    }

    function generateCitations(pub) {
      var text = pub.rawText || '';
      var normalized = text.replace(/''/g, '"');
      var titleMatch = normalized.match(/["“]([^"”]+)["”]/);
      var authorsPart = '';
      var restPart = normalized;
      var title = '';

      if (titleMatch) {
        title = titleMatch[1].trim().replace(/[,\s]+$/, '');
        authorsPart = normalized.slice(0, titleMatch.index).trim().replace(/[,;:\s]+$/, '');
        restPart = normalized.slice(titleMatch.index + titleMatch[0].length).trim();
      }

      restPart = restPart.replace(/^[,;:\s]+/, '').replace(/\s+/g, ' ');

      if (pub.type === 'conference') {
        var leadingChar = restPart.trim().charAt(0);
        if (leadingChar && /[A-Za-z0-9]/.test(leadingChar) && !/^in\b/i.test(restPart)) {
          restPart = 'in ' + restPart;
        }
      }

      var authorTokens = authorsPart
        .replace(/[\u3001\uFF0C;；]/g, ',')
        .replace(/\band\b/gi, ',')
        .split(/\s*,\s*/)
        .map(function (name) {
          return name.replace(/\*/g, '').trim();
        })
        .filter(Boolean);

      var gbtAuthors = '';
      if (authorTokens.length > 1) {
        gbtAuthors = authorTokens.slice(0, -1).join(', ') + ' and ' + authorTokens[authorTokens.length - 1];
      } else {
        gbtAuthors = authorTokens.join('');
      }

      var gbtParts = [];
      if (gbtAuthors) {
        gbtParts.push(gbtAuthors + '.');
      }
      if (title) {
        gbtParts.push('“' + title.replace(/\.$/, '') + '.”');
      }
      if (restPart) {
        gbtParts.push(restPart.replace(/\s*$/g, ''));
      }

      var gbtText = gbtParts.join(' ');
      if (gbtText && !/[。.!?]$/.test(gbtText)) {
        gbtText += '.';
      }

      var bibAuthor = authorTokens.join(' and ');
      var bibYear = pub.year || (pub.date ? pub.date.slice(0, 4) : '');
      var keyBase = authorTokens.length ? authorTokens[0].split(/\s+/).pop() : 'publication';
      keyBase = keyBase ? keyBase.toLowerCase().replace(/[^a-z0-9]+/g, '') : 'publication';
      var bibKey = keyBase + (bibYear || '');

      var bibLines = ['@misc{' + bibKey + ','];
      if (bibAuthor) {
        bibLines.push('  author = {' + bibAuthor + '},');
      }
      if (title) {
        bibLines.push('  title = {' + title.replace(/[{}]/g, '') + '},');
      }
      if (restPart) {
        bibLines.push('  howpublished = {' + restPart.replace(/[{}]/g, '') + '},');
      }
      if (bibYear) {
        bibLines.push('  year = {' + bibYear + '},');
      }
      bibLines.push('}');

      return {
        gbt: gbtText,
        bib: bibLines.join('\n')
      };
    }

    function openCitation(index, citations) {
      if (!citationModal || !citations) {
        return;
      }
      currentCitation = {
        index: index,
        gbt: citations.gbt,
        bib: citations.bib
      };
      activeCitationFormat = 'gbt';
      updateCitationContent();
      citationModal.removeAttribute('hidden');
      var focusTarget = citationModal.querySelector('.citation-modal__dialog');
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true });
      }
    }

    function closeCitation() {
      if (!citationModal) {
        return;
      }
      citationModal.setAttribute('hidden', '');
    }

    function updateCitationContent() {
      if (!citationModal || !currentCitation || !citationContent) {
        return;
      }
      citationTabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-format') === activeCitationFormat;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      var citationText = activeCitationFormat === 'bib' ? currentCitation.bib : currentCitation.gbt;
      if (activeCitationFormat === 'gbt' && currentCitation.index != null) {
        citationText = '[' + currentCitation.index + '] ' + citationText;
      }
      citationContent.textContent = citationText;
    }

    if (citationTabs.length) {
      citationTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var format = tab.getAttribute('data-format');
          if (!format || format === activeCitationFormat) {
            return;
          }
          activeCitationFormat = format;
          updateCitationContent();
        });
      });
    }

    if (citationClose) {
      citationClose.addEventListener('click', closeCitation);
    }

    if (citationModal) {
      citationModal.addEventListener('click', function (event) {
        if (event.target === citationModal) {
          closeCitation();
        }
      });
    }

    if (citationActions) {
      citationActions.addEventListener('click', function (event) {
        var actionButton = event.target.closest('button[data-action]');
        if (!actionButton || !currentCitation) {
          return;
        }
        var format = activeCitationFormat;
        var citationText = format === 'bib' ? currentCitation.bib : currentCitation.gbt;
        if (format === 'gbt' && currentCitation.index != null) {
          citationText = '[' + currentCitation.index + '] ' + citationText;
        }

        if (actionButton.getAttribute('data-action') === 'copy') {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(citationText).catch(function () {
              fallbackCopy(citationText);
            });
          } else {
            fallbackCopy(citationText);
          }
        } else if (actionButton.getAttribute('data-action') === 'download') {
          var extension = format === 'bib' ? 'bib' : 'txt';
          var filename = 'citation-' + currentCitation.index + '.' + extension;
          var blob = new Blob([citationText], { type: 'text/plain;charset=utf-8' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(function () {
            URL.revokeObjectURL(link.href);
          }, 0);
        }
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && citationModal && !citationModal.hasAttribute('hidden')) {
        closeCitation();
      }
    });

    function fallbackCopy(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        console.warn('Copy not supported');
      }
      document.body.removeChild(textarea);
    }

    render();
  });
})();
