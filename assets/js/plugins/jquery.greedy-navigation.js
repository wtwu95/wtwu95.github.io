/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('[data-nav-toggle]');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

function getVisibleItems() {
  return $vlinks.children();
}

function getHiddenItems() {
  return $hlinks.children();
}

var breaks = [];

function positionHiddenMenu() {
  if (!$btn.length || !$hlinks.length) {
    return;
  }

  var navEl = $nav.get(0);
  var buttonEl = $btn.get(0);

  if (!navEl || !buttonEl) {
    return;
  }

  var navRect = navEl.getBoundingClientRect();
  var buttonRect = buttonEl.getBoundingClientRect();

  var top = Math.round(buttonRect.bottom - navRect.top);
  var left = Math.round(buttonRect.left - navRect.left);

  $hlinks.css({
    top: top + 'px',
    left: left + 'px',
    right: 'auto'
  });
}

function resetHiddenMenuPosition() {
  $hlinks.css({
    top: '',
    right: '',
    left: ''
  });
}

function closeHiddenMenu() {
  if ($hlinks.length) {
    $hlinks.addClass('hidden');
    $hlinks.attr('aria-hidden', 'true');
    resetHiddenMenuPosition();
  }

  if ($btn.length) {
    $btn.removeClass('close');
    $btn.attr('aria-expanded', 'false');
  }
}

function openHiddenMenu() {
  if (!getHiddenItems().length) {
    closeHiddenMenu();
    return;
  }

  positionHiddenMenu();

  if ($hlinks.length) {
    $hlinks.removeClass('hidden');
    $hlinks.attr('aria-hidden', 'false');
  }

  if ($btn.length) {
    $btn.addClass('close');
    $btn.attr('aria-expanded', 'true');
  }
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
    }

    if (!$btn.hasClass('close')) {
      closeHiddenMenu();
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
      closeHiddenMenu();
      $btn.addClass('hidden');
      breaks = [];
    } else if (!$btn.hasClass('close')) {
      closeHiddenMenu();
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

$(window).resize(function() {
  updateNav();

  if ($btn.hasClass('close')) {
    openHiddenMenu();
  }
});

$btn.on('click', function() {
  if ($btn.hasClass('close')) {
    closeHiddenMenu();
  } else {
    openHiddenMenu();
  }
});

closeHiddenMenu();
updateNav();
