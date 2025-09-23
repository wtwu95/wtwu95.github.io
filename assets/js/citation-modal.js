(function () {
  function toArray(list) {
    if (!list) {
      return [];
    }
    return Array.prototype.slice.call(list);
  }

  var state = {
    initialized: false,
    modal: null,
    dialog: null,
    closeButton: null,
    tabs: [],
    actions: null,
    feedback: null,
    content: null,
    activeFormat: 'plain',
    currentCitation: null,
    copyFeedbackTimer: null,
    pendingRoots: [],
    pendingOpen: null,
    boundElements: typeof WeakSet !== 'undefined' ? new WeakSet() : null,
  };

  function readCitationFromElement(element) {
    if (!element) {
      return null;
    }
    var plain = element.getAttribute('data-citation-plain') || '';
    var bib =
      element.getAttribute('data-citation-bibtex') ||
      element.getAttribute('data-citation-bib') ||
      '';
    var index = element.getAttribute('data-citation-index') || '';
    var preferred = element.getAttribute('data-citation-format') || '';
    return {
      index: index,
      plain: plain,
      bib: bib,
      defaultFormat: preferred,
    };
  }

  function determineInitialFormat(citation) {
    if (!citation) {
      return 'plain';
    }
    var hasPlain = !!citation.plain;
    var hasBib = !!citation.bib;
    var preferred = citation.defaultFormat;
    if (preferred) {
      if (preferred === 'plain' && hasPlain) {
        return 'plain';
      }
      if (preferred === 'bib' && hasBib) {
        return 'bib';
      }
    }
    if (hasPlain) {
      return 'plain';
    }
    if (hasBib) {
      return 'bib';
    }
    return 'plain';
  }

  function ensureActiveFormatAvailable() {
    if (!state.currentCitation) {
      return;
    }
    var hasPlain = !!state.currentCitation.plain;
    var hasBib = !!state.currentCitation.bib;
    if (state.activeFormat === 'plain' && !hasPlain && hasBib) {
      state.activeFormat = 'bib';
    } else if (state.activeFormat === 'bib' && !hasBib && hasPlain) {
      state.activeFormat = 'plain';
    }
  }

  function updateTabs() {
    if (!state.tabs.length) {
      return;
    }
    var hasPlain = !!(state.currentCitation && state.currentCitation.plain);
    var hasBib = !!(state.currentCitation && state.currentCitation.bib);
    state.tabs.forEach(function (tab) {
      var format = tab.getAttribute('data-format');
      if (!format) {
        return;
      }
      var isActive = format === state.activeFormat;
      var hasContent = format === 'bib' ? hasBib : hasPlain;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('aria-disabled', hasContent ? 'false' : 'true');
      if (typeof tab.disabled === 'boolean') {
        tab.disabled = !hasContent;
      }
    });
  }

  function updateContent() {
    if (!state.content || !state.currentCitation) {
      return;
    }
    ensureActiveFormatAvailable();
    updateTabs();
    var text = state.activeFormat === 'bib'
      ? state.currentCitation.bib
      : state.currentCitation.plain;
    state.content.textContent = text || '';
  }

  function hideCopyFeedback() {
    if (!state.feedback) {
      return;
    }
    state.feedback.setAttribute('hidden', '');
    state.feedback.textContent = '';
    if (state.copyFeedbackTimer) {
      window.clearTimeout(state.copyFeedbackTimer);
      state.copyFeedbackTimer = null;
    }
  }

  function showCopyFeedback(message) {
    if (!state.feedback) {
      return;
    }
    state.feedback.textContent = message;
    state.feedback.removeAttribute('hidden');
    if (state.copyFeedbackTimer) {
      window.clearTimeout(state.copyFeedbackTimer);
    }
    state.copyFeedbackTimer = window.setTimeout(function () {
      hideCopyFeedback();
    }, 2000);
  }

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
    } catch (error) {
      console.warn('Copy command is not supported');
    }
    document.body.removeChild(textarea);
  }

  function closeModal() {
    if (!state.modal) {
      return;
    }
    state.modal.setAttribute('hidden', '');
    hideCopyFeedback();
  }

  function handleActionClick(event) {
    if (!state.actions || !state.currentCitation) {
      return;
    }
    var actionButton = event.target.closest('button[data-action]');
    if (!actionButton) {
      return;
    }
    event.preventDefault();
    var format = state.activeFormat === 'bib' ? 'bib' : 'plain';
    var citationText = format === 'bib'
      ? state.currentCitation.bib
      : state.currentCitation.plain;
    if (!citationText) {
      return;
    }
    var action = actionButton.getAttribute('data-action');
    if (action === 'copy') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citationText)
          .then(function () {
            showCopyFeedback('Citation copied to clipboard');
          })
          .catch(function () {
            fallbackCopy(citationText);
            showCopyFeedback('Citation copied to clipboard');
          });
      } else {
        fallbackCopy(citationText);
        showCopyFeedback('Citation copied to clipboard');
      }
    } else if (action === 'download') {
      hideCopyFeedback();
      var extension = format === 'bib' ? 'bib' : 'txt';
      var filename = 'citation';
      if (state.currentCitation.index) {
        filename += '-' + state.currentCitation.index;
      }
      filename += '.' + extension;
      var blob = new Blob([citationText], { type: 'text/plain;charset=utf-8' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () {
        URL.revokeObjectURL(link.href);
      }, 0);
    }
  }

  function openModal(citation) {
    if (!state.initialized) {
      state.pendingOpen = citation;
      return;
    }
    if (!state.modal || !citation) {
      return;
    }
    state.currentCitation = {
      index: citation.index || '',
      plain: citation.plain || '',
      bib: citation.bib || '',
    };
    state.activeFormat = determineInitialFormat(citation);
    hideCopyFeedback();
    updateContent();
    state.modal.removeAttribute('hidden');
    if (state.dialog && typeof state.dialog.focus === 'function') {
      state.dialog.focus({ preventScroll: true });
    }
  }

  function handleTabClick(event) {
    var tab = event.currentTarget;
    if (!tab || tab.disabled) {
      return;
    }
    var format = tab.getAttribute('data-format');
    if (!format || format === state.activeFormat) {
      return;
    }
    state.activeFormat = format;
    updateContent();
  }

  function isVisible(element) {
    return element && !element.hasAttribute('hidden');
  }

  function attachTrigger(element, citationData) {
    if (!element) {
      return;
    }
    if (state.boundElements) {
      if (state.boundElements.has(element)) {
        return;
      }
      state.boundElements.add(element);
    } else if (element.__citationModalBound) {
      return;
    } else {
      Object.defineProperty(element, '__citationModalBound', {
        value: true,
        configurable: true,
      });
    }

    element.addEventListener('click', function (event) {
      event.preventDefault();
      var citation = citationData || readCitationFromElement(element);
      if (!citation) {
        return;
      }
      openModal(citation);
    });
  }

  function bindTriggersInRoot(root) {
    if (!root) {
      return;
    }
    var nodes;
    if (root.querySelectorAll) {
      nodes = toArray(root.querySelectorAll('[data-citation-modal-trigger]'));
    } else {
      nodes = [];
    }
    if (root !== document && root !== window && root.matches && root.matches('[data-citation-modal-trigger]')) {
      nodes.push(root);
    }
    nodes.forEach(function (node) {
      attachTrigger(node, null);
    });
  }

  function refreshTriggers(root) {
    var targetRoot = root || document;
    if (!state.initialized) {
      state.pendingRoots.push(targetRoot);
      return;
    }
    bindTriggersInRoot(targetRoot);
  }

  function bindTrigger(element, citationData) {
    if (!element) {
      return;
    }
    if (!element.hasAttribute('data-citation-modal-trigger')) {
      element.setAttribute('data-citation-modal-trigger', '');
    }
    if (citationData) {
      if (citationData.index != null) {
        element.setAttribute('data-citation-index', String(citationData.index));
      }
      if (citationData.plain != null) {
        element.setAttribute('data-citation-plain', citationData.plain);
      }
      if (citationData.bib != null) {
        element.setAttribute('data-citation-bibtex', citationData.bib);
      }
      if (citationData.defaultFormat) {
        element.setAttribute('data-citation-format', citationData.defaultFormat);
      }
    }
    if (!state.initialized) {
      state.pendingRoots.push(element);
      return;
    }
    attachTrigger(element, citationData || readCitationFromElement(element));
  }

  function initialize() {
    if (state.initialized) {
      return;
    }
    state.modal = document.getElementById('citation-modal');
    state.dialog = state.modal ? state.modal.querySelector('.citation-modal__dialog') : null;
    state.closeButton = state.modal ? state.modal.querySelector('.citation-modal__close') : null;
    state.tabs = state.modal ? toArray(state.modal.querySelectorAll('.citation-modal__tab')) : [];
    state.actions = state.modal ? state.modal.querySelector('.citation-modal__actions') : null;
    state.feedback = state.modal ? state.modal.querySelector('.citation-modal__feedback') : null;
    state.content = state.modal ? state.modal.querySelector('.citation-modal__content') : null;
    state.initialized = true;

    if (!state.modal) {
      state.pendingRoots.length = 0;
      state.pendingOpen = null;
      return;
    }

    if (state.closeButton) {
      state.closeButton.addEventListener('click', closeModal);
    }

    if (state.modal) {
      state.modal.addEventListener('click', function (event) {
        if (event.target === state.modal) {
          closeModal();
        }
      });
    }

    if (state.tabs.length) {
      state.tabs.forEach(function (tab) {
        tab.addEventListener('click', handleTabClick);
      });
    }

    if (state.actions) {
      state.actions.addEventListener('click', handleActionClick);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isVisible(state.modal)) {
        closeModal();
      }
    });

    bindTriggersInRoot(document);
    if (state.pendingRoots.length) {
      state.pendingRoots.forEach(bindTriggersInRoot);
      state.pendingRoots.length = 0;
    }
    if (state.pendingOpen) {
      var pending = state.pendingOpen;
      state.pendingOpen = null;
      openModal(pending);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  window.CitationModal = {
    open: openModal,
    close: closeModal,
    refreshTriggers: refreshTriggers,
    bindTrigger: bindTrigger,
  };
})();
