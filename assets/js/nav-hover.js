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
    var openedByHover = false;
    var hoverQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

    function hasHiddenItems() {
      return hiddenLinks.children.length > 0;
    }

    function isMenuOpen() {
      return !hiddenLinks.classList.contains('hidden') &&
        !toggleButton.classList.contains('hidden') && hasHiddenItems();
    }

    function syncMenuState() {
      var isOpen = isMenuOpen();
      if (!isOpen) {
        openedByHover = false;
      }
      hiddenLinks.setAttribute('aria-hidden', String(!isOpen));
      toggleButton.setAttribute('aria-expanded', String(isOpen));
      toggleButton.classList.toggle('close', isOpen);
    }

    function openMenu() {
      if (!isMenuOpen() && !toggleButton.classList.contains('hidden') && hasHiddenItems()) {
        openedByHover = true;
        hiddenLinks.classList.remove('hidden');
        syncMenuState();
      }
    }

    function closeMenu() {
      hiddenLinks.classList.add('hidden');
      syncMenuState();
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
        // Keep keyboard users' focused links visible when the pointer leaves.
        if (!moreContainer.contains(document.activeElement)) {
          closeMenu();
        }
        closeTimer = null;
      }, 150);
    }

    moreContainer.addEventListener('mouseenter', function () {
      clearCloseTimer();
      if (!hoverQuery || hoverQuery.matches) {
        openMenu();
      }
    });

    moreContainer.addEventListener('mouseleave', function () {
      scheduleClose();
    });

    moreContainer.addEventListener('focusin', function () {
      clearCloseTimer();
    });

    moreContainer.addEventListener('focusout', function (event) {
      if (event.relatedTarget && moreContainer.contains(event.relatedTarget)) {
        return;
      }

      scheduleClose();
    });

    // The bundled navigation owns button clicks and responsive link movement.
    // A pointer's first click should keep the menu it just opened by hover open.
    // Reset that transient state before the bundle handles the same click.
    toggleButton.addEventListener('click', function (event) {
      if (event.detail > 0 && openedByHover && isMenuOpen()) {
        closeMenu();
      }
    }, true);
    toggleButton.addEventListener('click', function () {
      openedByHover = false;
      syncMenuState();
    });

    document.addEventListener('click', function (event) {
      if (!moreContainer.contains(event.target)) {
        clearCloseTimer();
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        var restoreFocus = hiddenLinks.contains(document.activeElement);
        clearCloseTimer();
        closeMenu();
        event.preventDefault();
        if (restoreFocus) {
          toggleButton.focus({ preventScroll: true });
        }
      }
    });

    if (window.MutationObserver) {
      var menuObserver = new MutationObserver(syncMenuState);
      menuObserver.observe(hiddenLinks, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true
      });
    }

    syncMenuState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGreedyNavHover);
  } else {
    initializeGreedyNavHover();
  }
})();
