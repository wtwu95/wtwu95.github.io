(function () {
  'use strict';

  function initializeGreedyNavHover() {
    var moreContainer = document.querySelector('.greedy-nav__more');
    if (!moreContainer) {
      return;
    }

    var toggleButton = moreContainer.querySelector('[data-nav-toggle]');
    var hiddenLinks = moreContainer.querySelector('.hidden-links');

    if (!toggleButton || !hiddenLinks) {
      return;
    }

    var pointerQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(hover: hover) and (pointer: fine)')
        : null;
    var closeTimer = null;

    function hasHiddenItems() {
      return hiddenLinks.children.length > 0;
    }

    function isExpanded() {
      return toggleButton.getAttribute('aria-expanded') === 'true';
    }

    function createToggleEvent(type) {
      if (typeof window.CustomEvent === 'function') {
        return new CustomEvent(type, { bubbles: true });
      }

      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, null);
      return event;
    }

    function dispatchToggleEvent(type) {
      toggleButton.dispatchEvent(createToggleEvent(type));
    }

    function openMenu() {
      if (toggleButton.classList.contains('hidden')) {
        return;
      }

      if (!hasHiddenItems()) {
        return;
      }

      if (isExpanded()) {
        return;
      }

      dispatchToggleEvent('greedyNav:open');
    }

    function closeMenu() {
      if (!isExpanded()) {
        return;
      }

      dispatchToggleEvent('greedyNav:close');
    }

    function clearCloseTimer() {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function scheduleClose() {
      clearCloseTimer();
      closeTimer = window.setTimeout(function () {
        if (moreContainer.contains(document.activeElement)) {
          closeTimer = null;
          return;
        }

        closeMenu();
        closeTimer = null;
      }, 150);
    }

    var handlePointerEnter = function () {
      clearCloseTimer();
      openMenu();
    };

    var handlePointerLeave = function () {
      scheduleClose();
    };

    function bindHover() {
      moreContainer.addEventListener('mouseenter', handlePointerEnter);
      moreContainer.addEventListener('mouseleave', handlePointerLeave);
    }

    function unbindHover() {
      moreContainer.removeEventListener('mouseenter', handlePointerEnter);
      moreContainer.removeEventListener('mouseleave', handlePointerLeave);
      clearCloseTimer();
      closeMenu();
    }

    if (pointerQuery && pointerQuery.matches) {
      bindHover();
    }

    if (pointerQuery && typeof pointerQuery.addEventListener === 'function') {
      pointerQuery.addEventListener('change', function (event) {
        if (event.matches) {
          bindHover();
        } else {
          unbindHover();
        }
      });
    } else if (pointerQuery && typeof pointerQuery.addListener === 'function') {
      pointerQuery.addListener(function (event) {
        if (event.matches) {
          bindHover();
        } else {
          unbindHover();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGreedyNavHover);
  } else {
    initializeGreedyNavHover();
  }
})();
