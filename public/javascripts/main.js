$(function () {
    var startPos = 0;
    var timerInterval = 500;
    var $container = $('#FocusContainer');
    var $mainFocus = $container.find('#MainFocus');
    var length = $mainFocus.find('li').length - 1;
    var _moveFocus = function () {
        if (length <= 0) {
            $mainFocus.append($mainFocus.find('li:lt(3)').remove()).css('margin-left', '0px');
            length = $mainFocus.find('li').length - 1;
            startPos = 0;
        }

        startPos = startPos - 928;
        $container.find('.focus-details').fadeOut(function () {
            $mainFocus.animate({
                'margin-left': startPos + 'px'
            }, timerInterval, function () {
                $container.find('.focus-details').fadeIn();
            });
            length--;
        });
    };
    var timerId = setInterval(_moveFocus, 3000);

    $mainFocus.hover(function () {
        $container.find('.focus-left-arrow').show();
        $container.find('.focus-right-arrow').show();
    }, function () {
        $container.find('.focus-left-arrow').hide();
        $container.find('.focus-right-arrow').hide();
    });
})
