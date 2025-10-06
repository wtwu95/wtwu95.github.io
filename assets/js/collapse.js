(function ($) {
  'use strict';

  $(function () {
    $('.header').on('click', function () {
      var $header = $(this);
      var $content = $header.next();

      $content.stop(true, true).slideToggle(500, function () {
        $header.text($content.is(':visible') ? 'Collapse' : 'Expand');
      });
    });
  });
})(jQuery);
