/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('[data-nav-toggle]');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('.greedy-nav__more .hidden-links');
var docClickHandler = null;
var resizeTimer;

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

var breaks = [];

function manageDocClickListener(shouldBind) {
  if(shouldBind) {
    if(!docClickHandler) {
      docClickHandler = function(event) {
        if(!$(event.target).closest('.greedy-nav__more').length) {
          setMenuOpen(false);
        }
      };
      $(document).on('click.greedyNavOutside', docClickHandler);
    }
  } else if(docClickHandler) {
    $(document).off('click.greedyNavOutside', docClickHandler);
    docClickHandler = null;
  }
}

function setMenuOpen(isOpen) {
  $hlinks.toggleClass('hidden', !isOpen);
  $hlinks.attr('aria-hidden', isOpen ? 'false' : 'true');
  $btn.toggleClass('close', isOpen);
  $btn.attr('aria-expanded', isOpen ? 'true' : 'false');
  manageDocClickListener(isOpen);
}

function isMenuOpen() {
  return $btn.attr('aria-expanded') === 'true';
}

function hasHiddenItems() {
  return getHiddenItems().length > 0;
}

function openMenu() {
  if($btn.hasClass('hidden')) {
    return false;
  }

  if(!hasHiddenItems()) {
    setMenuOpen(false);
    return false;
  }

  if(isMenuOpen()) {
    return true;
  }

  setMenuOpen(true);
  return true;
}

function closeMenu() {
  if(!isMenuOpen()) {
    return false;
  }

  setMenuOpen(false);
  return true;
}

function toggleMenu(forceState) {
  var shouldOpen = typeof forceState === 'boolean' ? forceState : !isMenuOpen();
  return shouldOpen ? openMenu() : closeMenu();
}

function updateNav() {

  var availableSpace = $nav.width();
  var $visibleItems = getVisibleItems();

  // The visible list is overflowing the nav
  if($vlinks.width() > availableSpace && $visibleItems.length) {

    // Record the width of the list
    breaks.push($vlinks.width());

    // Move item to the hidden list
    $visibleItems.last().prependTo($hlinks);

    // Show the dropdown btn
    if($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
      $btn.removeClass('close');
      $btn.attr('aria-expanded', 'false');
      $hlinks.attr('aria-hidden', 'true');
    }

  // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    if(breaks.length && availableSpace > breaks[breaks.length-1]) {

      // Move the item to the visible list
      var $hiddenItems = getHiddenItems();
      if ($hiddenItems.length) {
        $hiddenItems.first().appendTo($vlinks);
        breaks.pop();
      } else {
        breaks = [];
      }
    }

    // Hide the dropdown btn if hidden list is empty
    if(getHiddenItems().length < 1) {
      $btn.addClass('hidden');
      closeMenu();
      $hlinks.attr('aria-hidden', 'true');
      $btn.attr('aria-expanded', 'false');
      breaks = [];
    }
  }

  // Keep counter updated
  $btn.attr("count", getHiddenItems().length);

  // Recur if the visible list is still overflowing the nav
  if($vlinks.width() > availableSpace && getVisibleItems().length) {
    updateNav();
  }

}

// Window listeners

$(window).on('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if(typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(updateNav);
    } else {
      updateNav();
    }
  }, 150);
});

$btn.on('click', function() {
  toggleMenu();
});

$btn.on('keydown', function(event) {
  if(event.key === 'Escape' || event.keyCode === 27) {
    closeMenu();
  }
});

function assignController() {
  var buttonNode = $btn.get(0);
  if(!buttonNode) {
    return;
  }

  buttonNode.greedyNavController = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: isMenuOpen,
    hasHiddenItems: hasHiddenItems
  };
}

assignController();

updateNav();
