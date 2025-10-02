/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav .greedy-nav__toggle');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');
var $toggleClones = $hlinks.find('.masthead__menu-item--toggle-clone');

function getVisibleItems() {
  return $vlinks
    .children()
    .not('.masthead__menu-item--toggle')
    .not('.masthead__menu-item--toggle-clone');
}

function getHiddenItems() {
  return $hlinks
    .children()
    .not('.masthead__menu-item--toggle')
    .not('.masthead__menu-item--toggle-clone');
}

function syncToggleClones() {
  if (!$toggleClones.length) {
    return;
  }

  $toggleClones.each(function () {
    var $clone = $(this);
    var selector = $clone.hasClass('masthead__menu-item--toggle-language')
      ? '.masthead__menu-item--toggle-language'
      : '.masthead__menu-item--toggle-theme';

    var hasOriginal =
      $vlinks.children(selector).filter(':not(.masthead__menu-item--toggle-clone)').length > 0 ||
      $hlinks
        .children(selector)
        .not($clone)
        .filter(':not(.masthead__menu-item--toggle-clone)')
        .length > 0;

    if (hasOriginal) {
      $clone.attr('hidden', true);
    } else {
      $clone.attr('hidden', false);
    }
  });
}

var breaks = [];

function updateNav() {

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;
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
      $hlinks.addClass('hidden');
      breaks = [];
    }
  }

  // Keep counter updated
  $btn.attr("count", getHiddenItems().length);

  // Recur if the visible list is still overflowing the nav
  if($vlinks.width() > availableSpace && getVisibleItems().length) {
    updateNav();
  }

  syncToggleClones();
}

// Window listeners

$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

syncToggleClones();
updateNav();