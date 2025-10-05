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
      setMenuOpen(false);
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
  var isHidden = $hlinks.hasClass('hidden');
  setMenuOpen(isHidden);
  $hlinks.attr('aria-hidden', isHidden ? 'false' : 'true');
});

$btn.on('keydown', function(event) {
  if(event.key === 'Escape' || event.keyCode === 27) {
    setMenuOpen(false);
  }
});

updateNav();
