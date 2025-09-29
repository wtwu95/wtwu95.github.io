(function () {
  'use strict';

  var BREAKPOINT_MAX = '(max-width: 924px)';
  var MAP_VISITORS_CLASS = 'author__map--visitors';
  var MAP_ASPECT_PROPERTY = '--author-map-aspect';
  var DEFAULT_ASPECT = 1;

  function schedule(callback) {
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(callback);
    } else {
      window.setTimeout(callback, 0);
    }
  }

  function setRootAspectRatio(ratio) {
    if (!ratio || !isFinite(ratio)) {
      return;
    }

    var value = Math.max(0.25, Math.min(ratio, 5));
    document.documentElement.style.setProperty(MAP_ASPECT_PROPERTY, value.toString());
  }

  function elementChildren(parent) {
    if (!parent) {
      return [];
    }

    return Array.prototype.filter.call(parent.children || [], function (child) {
      return child.nodeType === 1 && child.tagName !== 'SCRIPT';
    });
  }

  function removeDuplicateVisitorMaps(container) {
    var children = elementChildren(container);
    if (children.length <= 1) {
      return children[0] || null;
    }

    for (var i = 0; i < children.length - 1; i += 1) {
      if (children[i] && children[i].parentNode) {
        children[i].parentNode.removeChild(children[i]);
      }
    }

    return children[children.length - 1] || null;
  }

  function normaliseDimensions(element) {
    if (!element || element.nodeType !== 1) {
      return;
    }

    if (element.hasAttribute('width')) {
      element.removeAttribute('width');
    }

    if (element.hasAttribute('height')) {
      element.removeAttribute('height');
    }

    var tagName = element.tagName ? element.tagName.toLowerCase() : '';
    var canStretch = tagName === 'div' ||
      tagName === 'span' ||
      tagName === 'iframe' ||
      tagName === 'object' ||
      tagName === 'embed' ||
      tagName === 'img' ||
      tagName === 'svg' ||
      tagName === 'canvas';

    if (canStretch && element.style) {
      if (element.style.width && element.style.width !== 'auto') {
        element.style.width = '100%';
      }

      if (element.style.height && element.style.height !== 'auto') {
        element.style.height = '100%';
      }
    }
  }

  function normaliseVisitorTree(element) {
    if (!element || element.nodeType !== 1) {
      return;
    }

    normaliseDimensions(element);

    var children = element.children;
    for (var i = 0; i < children.length; i += 1) {
      normaliseVisitorTree(children[i]);
    }
  }

  function findVisualElement(root) {
    if (!root || root.nodeType !== 1) {
      return null;
    }

    var selectors = 'iframe, object, embed, img, svg, canvas';
    var candidate = root.querySelector(selectors);
    return candidate || root;
  }

  function extractAspectRatio(element) {
    if (!element || element.nodeType !== 1) {
      return null;
    }

    var width = parseFloat(element.getAttribute('width'));
    var height = parseFloat(element.getAttribute('height'));

    if (!(width > 0 && height > 0)) {
      var rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }

    if (!(width > 0 && height > 0)) {
      return null;
    }

    return width / height;
  }

  function setupVisitorMapSizing(mapSidebar) {
    if (!mapSidebar) {
      return;
    }

    var visitorsContainer = mapSidebar.querySelector('.' + MAP_VISITORS_CLASS);
    if (!visitorsContainer) {
      return;
    }

    var lastRatio = DEFAULT_ASPECT;

    function applySizing() {
      var root = removeDuplicateVisitorMaps(visitorsContainer);
      if (!root) {
        return;
      }

      normaliseVisitorTree(root);

      var embedElements = root.querySelectorAll('iframe, object, embed');
      if (embedElements.length > 1) {
        for (var i = 0; i < embedElements.length - 1; i += 1) {
          var embed = embedElements[i];
          if (embed && embed.parentNode) {
            embed.parentNode.removeChild(embed);
          }
        }
      }

      var visualElement = findVisualElement(root);
      if (visualElement && visualElement !== root) {
        normaliseVisitorTree(visualElement);
      }

      var ratio = extractAspectRatio(visualElement || root);
      if (ratio && Math.abs(ratio - lastRatio) > 0.01) {
        lastRatio = ratio;
        setRootAspectRatio(ratio);
      }
    }

    applySizing();

    if (typeof MutationObserver === 'function') {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i += 1) {
          var mutation = mutations[i];
          if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
            schedule(applySizing);
            return;
          }
        }
      });

      observer.observe(visitorsContainer, { childList: true, subtree: true });
    }

    window.addEventListener('resize', function () {
      schedule(applySizing);
    });
  }

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  onReady(function () {
    var mapSidebar = document.querySelector('.author__map-sidebar');
    if (!mapSidebar) {
      return;
    }

    var mapsContainer = mapSidebar.querySelector('.author__maps');
    if (mapsContainer && mapsContainer.classList.contains('author__maps--mobile-hidden')) {
      return;
    }

    setupVisitorMapSizing(mapSidebar);

    var sidebar = mapSidebar.closest('.sidebar');
    var main = document.getElementById('main');
    if (!sidebar || !main) {
      return;
    }

    var article = main.querySelector('article.page');
    if (!article) {
      return;
    }

    var pageInner = article.querySelector('.page__inner-wrap') || article;

    var placeholder = document.createComment('author__map-sidebar placeholder');
    if (mapSidebar.parentNode) {
      mapSidebar.parentNode.insertBefore(placeholder, mapSidebar);
    }

    var mediaQuery = window.matchMedia ? window.matchMedia(BREAKPOINT_MAX) : null;

    function shouldMoveToContent() {
      return mediaQuery ? mediaQuery.matches : window.innerWidth <= 924;
    }

    function moveToContent() {
      if (mapSidebar.parentNode !== pageInner) {
        pageInner.appendChild(mapSidebar);
      }
      mapSidebar.classList.add('author__map-sidebar--inline');
    }

    function moveToSidebar() {
      if (placeholder.parentNode && mapSidebar.parentNode !== placeholder.parentNode) {
        placeholder.parentNode.insertBefore(mapSidebar, placeholder);
      }
      mapSidebar.classList.remove('author__map-sidebar--inline');
    }

    function updatePlacement() {
      if (shouldMoveToContent()) {
        moveToContent();
      } else {
        moveToSidebar();
      }
    }

    updatePlacement();

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updatePlacement);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(updatePlacement);
      }
    } else {
      window.addEventListener('resize', updatePlacement);
    }
  });
})();
