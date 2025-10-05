(function ($) {
  'use strict';

  $(function () {
    $('.header').on('click', function () {
      var $header = $(this);
      var $content = $header.next();

      var willBeVisible = !$content.is(':visible');

      $header.text(willBeVisible ? 'Collapse' : 'Expand');

      $content.stop(true, true).slideToggle(500);
    });
  });
})(jQuery);
