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

    if (!sourceList || !listEl || !typeSelect || !yearSelect || !sortButton) {
      return;
    }

    var typeLabels = {
      journal: { en: 'Journal Papers', zh: '期刊论文' },
      conference: { en: 'Conference Papers', zh: '会议论文' },
      review: { en: 'Review Papers', zh: '综述论文' },
      preprint: { en: 'Preprints', zh: '预印本' },
      other: { en: 'Other', zh: '其他' }
    };

    var typeOrder = ['journal', 'conference', 'review', 'preprint'];
    var orderedTypes = [];

    function getCurrentLanguage() {
      var html = document.documentElement;
      var language = (html.getAttribute('data-language') || html.getAttribute('lang') || 'en').toLowerCase();
      return language === 'zh' ? 'zh' : 'en';
    }

    function getTypeLabel(type, language) {
      var labels = typeLabels[type];
      if (!labels) {
        return type;
      }
      if (typeof labels === 'string') {
        return labels;
      }
      return labels[language] || labels.en || type;
    }

    function getSelectLabel(select, language) {
      if (!select) {
        return language === 'zh' ? '类型' : 'Type';
      }
      var attrName = language === 'zh' ? 'data-label-zh' : 'data-label-en';
      var label = select.getAttribute(attrName);
      if (!label) {
        label = language === 'zh' ? '类型' : 'Type';
      }
      return label;
    }

    function buildTypeOptions() {
      var language = getCurrentLanguage();
      var currentValue = typeSelect.value;
      var optionsHtml = orderedTypes.map(function (type) {
        return '<option value="' + type + '">' + getTypeLabel(type, language) + '</option>';
      }).join('');
      var defaultLabel = getSelectLabel(typeSelect, language);
      typeSelect.innerHTML = '<option value="all">' + defaultLabel + '</option>' + optionsHtml;
      if (currentValue && (currentValue === 'all' || orderedTypes.indexOf(currentValue) !== -1)) {
        typeSelect.value = currentValue;
      } else {
        typeSelect.value = 'all';
      }
    }

    var searchTerm = '';
    var citationManager = window.CitationModal || null;

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
      var plainCitation = item.getAttribute('data-citation-plain') || '';
      var bibCitation = item.getAttribute('data-citation-bibtex') || '';
      var sanitized = sanitizeNode(item);
      var textContent = sanitized.textContent.replace(/\s+/g, ' ').trim();
      var normalizedText = normalizeQuotes(textContent);
      return {
        type: item.getAttribute('data-type') || 'other',
        year: isNaN(year) ? null : year,
        date: item.getAttribute('data-date') || '',
        content: item.innerHTML.trim(),
        rawText: normalizedText,
        searchText: normalizedText.toLowerCase(),
        plainCitation: plainCitation,
        bibCitation: bibCitation
      };
    });

    publications = publications.map(function (pub) {
      pub.citations = generateCitations(pub);
      return pub;
    });

    var uniqueTypes = Array.from(new Set(publications.map(function (pub) {
      return pub.type;
    }).filter(Boolean)));

    orderedTypes = typeOrder.filter(function (type) {
      return uniqueTypes.indexOf(type) !== -1;
    });

    uniqueTypes.forEach(function (type) {
      if (typeOrder.indexOf(type) === -1) {
        orderedTypes.push(type);
      }
    });

    buildTypeOptions();

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
      var highlightTerm = searchInput ? searchInput.value.trim() : '';
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
        applySearchHighlight(bodyEl, highlightTerm);

        var actions = document.createElement('div');
        actions.className = 'publication-actions';
        var hasActions = false;

        if (pub.citations) {
          var citeButton = document.createElement('button');
          citeButton.type = 'button';
          citeButton.className = 'publication-cite';
          citeButton.innerHTML = '<img src="https://img.shields.io/badge/Link-Cite-0969da?labelColor=555" alt="Cite badge">';
          citeButton.setAttribute('aria-label', 'Cite this publication');
          citeButton.setAttribute('data-citation-modal-trigger', '');
          citeButton.setAttribute('data-citation-index', String(number));
          if (pub.citations.plain) {
            citeButton.setAttribute('data-citation-plain', pub.citations.plain);
          }
          if (pub.citations.bib) {
            citeButton.setAttribute('data-citation-bibtex', pub.citations.bib);
          }
          actions.appendChild(citeButton);
          var manager = citationManager || window.CitationModal;
          if (manager && typeof manager.refreshTriggers === 'function') {
            manager.refreshTriggers(actions);
          }
          hasActions = true;
        }

        var findAncestorLink = function (node) {
          var current = node;
          while (current) {
            if (current.tagName && current.tagName.toLowerCase() === 'a') {
              return current;
            }
            if (current === bodyEl) {
              return null;
            }
            current = current.parentNode;
          }
          return null;
        };

        var badgeImages = Array.prototype.slice.call(bodyEl.querySelectorAll('a img'));
        var pdfBadges = [];
        var videoBadges = [];
        var otherBadges = [];

        badgeImages.forEach(function (img) {
          var link = findAncestorLink(img);
          if (!link) {
            return;
          }
          var altText = (img.getAttribute('alt') || '').toLowerCase();
          if (altText.indexOf('pdf') !== -1 && altText.indexOf('badge') !== -1) {
            pdfBadges.push(link);
            return;
          }
          if (altText.indexOf('video') !== -1 && altText.indexOf('badge') !== -1) {
            videoBadges.push(link);
            return;
          }
          if (altText.indexOf('badge') !== -1) {
            otherBadges.push(link);
          }
        });

        var appendedBadges = [];
        var appendBadge = function (link) {
          if (!link || appendedBadges.indexOf(link) !== -1) {
            return;
          }
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
          link.classList.add('publication-badge');
          var badgeImage = link.querySelector('img');
          if (badgeImage) {
            badgeImage.classList.add('publication-badge__image');
          }
          actions.appendChild(link);
          appendedBadges.push(link);
          hasActions = true;
        };

        pdfBadges.forEach(appendBadge);
        videoBadges.forEach(appendBadge);
        otherBadges.forEach(appendBadge);

        if (hasActions) {
          bodyEl.appendChild(actions);
        }

        li.appendChild(indexEl);
        li.appendChild(bodyEl);

        var yearEl = document.createElement('span');
        yearEl.className = 'publication-year';
        yearEl.textContent = pub.year ? String(pub.year) : '';
        li.appendChild(yearEl);

        listEl.appendChild(li);
      });
    }

    typeSelect.addEventListener('change', render);
    yearSelect.addEventListener('change', render);
    sortButton.addEventListener('click', function () {
      sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      sortButton.textContent = sortOrder === 'desc' ? '⬇' : '⬆';
      render();
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchTerm = this.value.trim().toLowerCase();
        render();
      });
    }

    if (window.MutationObserver) {
      var languageObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-language') {
            buildTypeOptions();
            render();
            break;
          }
        }
      });
      languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-language']
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

    function applySearchHighlight(container, term) {
      var rawTerm = term ? term.trim() : '';
      if (!rawTerm) {
        return;
      }
      var normalized = rawTerm.toLowerCase();
      if (!normalized) {
        return;
      }

      var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
      var nodes = [];
      var node;

      while ((node = walker.nextNode())) {
        var value = node.nodeValue;
        if (value && value.trim() && value.toLowerCase().indexOf(normalized) !== -1) {
          nodes.push(node);
        }
      }

      var termLength = rawTerm.length;

      nodes.forEach(function (textNode) {
        if (!textNode.parentNode) {
          return;
        }
        var text = textNode.nodeValue;
        var lower = text.toLowerCase();
        var fragment = document.createDocumentFragment();
        var index = 0;
        var matchIndex;

        while ((matchIndex = lower.indexOf(normalized, index)) !== -1) {
          if (matchIndex > index) {
            fragment.appendChild(document.createTextNode(text.slice(index, matchIndex)));
          }

          var mark = document.createElement('mark');
          mark.className = 'publication-highlight';
          mark.textContent = text.slice(matchIndex, matchIndex + termLength);
          fragment.appendChild(mark);

          index = matchIndex + termLength;
        }

        if (index < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(index)));
        }

        textNode.parentNode.replaceChild(fragment, textNode);
      });
    }

    function parseBibtexEntry(text) {
      if (!text) {
        return null;
      }
      var headerMatch = text.match(/@\s*([^{\s]+)\s*\{\s*([^,]+),/i);
      if (!headerMatch) {
        return null;
      }
      var fieldRegex = /([a-zA-Z]+)\s*=\s*\{([^{}]*)\}/g;
      var match;
      var fields = {};
      while ((match = fieldRegex.exec(text)) !== null) {
        var fieldName = match[1].toLowerCase();
        var fieldValue = match[2].trim();
        if (fieldValue) {
          fields[fieldName] = fieldValue;
        }
      }
      return {
        type: headerMatch[1].toLowerCase(),
        key: headerMatch[2].trim(),
        fields: fields
      };
    }

    function formatAuthorName(name) {
      var trimmed = name.trim();
      if (!trimmed) {
        return '';
      }
      var surname;
      var givenNames;
      if (trimmed.indexOf(',') !== -1) {
        var parts = trimmed.split(',');
        surname = parts[0].trim();
        givenNames = parts.slice(1).join(',').trim();
      } else {
        var tokens = trimmed.split(/\s+/);
        surname = tokens.pop();
        givenNames = tokens.join(' ');
      }
      if (!surname) {
        return trimmed;
      }
      if (!givenNames) {
        return surname;
      }
      var initials = givenNames
        .split(/\s+/)
        .filter(Boolean)
        .map(function (token) {
          var cleaned = token.replace(/[{}\.]/g, '');
          if (!cleaned) {
            return '';
          }
          var hyphenParts = cleaned.split('-').filter(Boolean).map(function (part) {
            return part.charAt(0).toUpperCase() + '.';
          });
          return hyphenParts.join('-');
        })
        .filter(Boolean);
      if (!initials.length) {
        return surname;
      }
      return initials.join(' ') + ' ' + surname;
    }

    function formatAuthorList(authorField) {
      if (!authorField) {
        return '';
      }
      var authors = authorField
        .split(/\s+and\s+/i)
        .map(formatAuthorName)
        .filter(Boolean);
      if (!authors.length) {
        return '';
      }
      if (authors.length === 1) {
        return authors[0];
      }
      return authors.slice(0, -1).join(', ') + ', and ' + authors[authors.length - 1];
    }

    function formatPages(pages) {
      if (!pages) {
        return '';
      }
      return pages.replace(/--+/g, '–');
    }

    function ensureSentenceEnding(text) {
      if (!text) {
        return '';
      }
      var trimmed = text.trim();
      if (!trimmed) {
        return '';
      }
      if (/[.!?。]$/.test(trimmed)) {
        return trimmed;
      }
      return trimmed + '.';
    }

    function formatPlainCitationFromBib(entry) {
      if (!entry) {
        return '';
      }
      var fields = entry.fields || {};
      var authors = formatAuthorList(fields.author);
      var title = fields.title ? fields.title.replace(/[\s]+$/g, '').replace(/[\.]$/g, '') : '';
      var parts = [];
      if (authors) {
        parts.push(authors);
      }
      if (title) {
        parts.push('“' + title + ',”');
      }
      var type = entry.type;
      if (type === 'inproceedings' || type === 'conference' || type === 'proceedings') {
        if (fields.booktitle) {
          parts.push('in ' + fields.booktitle);
        }
        if (fields.organization) {
          parts.push(fields.organization);
        } else if (fields.publisher) {
          parts.push(fields.publisher);
        }
        if (fields.pages) {
          parts.push('pp. ' + formatPages(fields.pages));
        }
        if (fields.year) {
          parts.push(fields.year);
        }
      } else {
        if (fields.journal) {
          parts.push(fields.journal);
        } else if (fields.booktitle) {
          parts.push(fields.booktitle);
        }
        if (fields.volume) {
          parts.push('vol. ' + fields.volume);
        }
        if (fields.number) {
          parts.push('no. ' + fields.number);
        }
        if (fields.pages) {
          parts.push('pp. ' + formatPages(fields.pages));
        }
        if (fields.year) {
          parts.push(fields.year);
        }
      }
      if (fields.note) {
        parts.push(fields.note);
      }
      var citation = parts.join(', ');
      return ensureSentenceEnding(citation);
    }

    function generateCitations(pub) {
      var bibText = pub.bibCitation || '';
      var plainText = '';
      if (bibText) {
        plainText = formatPlainCitationFromBib(parseBibtexEntry(bibText));
      }
      if (!plainText && pub.plainCitation) {
        plainText = ensureSentenceEnding(pub.plainCitation);
      }
      var bibOutput = bibText || '';
      if (!plainText && !bibOutput) {
        return null;
      }
      return {
        plain: plainText,
        bib: bibOutput
      };
    }

    render();
  });
})();
