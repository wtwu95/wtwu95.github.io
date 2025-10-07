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

    var closeTimer = null;

    function hasHiddenItems() {
      return hiddenLinks.children.length > 0;
    }

    function openMenu() {
      if (toggleButton.classList.contains('hidden')) {
        return;
      }

      if (toggleButton.getAttribute('aria-expanded') === 'true') {
        return;
      }

      if (!hasHiddenItems()) {
        return;
      }

      toggleButton.click();
    }

    function closeMenu() {
      if (toggleButton.getAttribute('aria-expanded') !== 'true') {
        return;
      }

      toggleButton.click();
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
        closeMenu();
        closeTimer = null;
      }, 150);
    }

    moreContainer.addEventListener('mouseenter', function () {
      clearCloseTimer();
      openMenu();
    });

    moreContainer.addEventListener('mouseleave', function () {
      scheduleClose();
    });

    moreContainer.addEventListener('focusin', function () {
      clearCloseTimer();
      openMenu();
    });

    moreContainer.addEventListener('focusout', function (event) {
      if (event.relatedTarget && moreContainer.contains(event.relatedTarget)) {
        return;
      }

      scheduleClose();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGreedyNavHover);
  } else {
    initializeGreedyNavHover();
  }
})();
