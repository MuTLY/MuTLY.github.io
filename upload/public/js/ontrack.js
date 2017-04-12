/* General functions */
function whichTransitionEvent() {
    "use strict";
    var i, e = document.createElement("div"),
        s = {
            transition: "transitionend",
            OTransition: "otransitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
    for (i in s) if (s.hasOwnProperty(i) && void 0 !== e.style[i]) return s[i];
}

function whichAnimationEvent() {
    "use strict";
    var i, e = document.createElement("div"),
        s = {
            animation: "animationend",
            OAnimation: "oanimationend",
            MozAnimation: "animationend",
            WebkitAnimation: "webkitAnimationEnd"
        };
    for (i in s) if (s.hasOwnProperty(i) && void 0 !== e.style[i]) return s[i];
}

var transitionEnd = whichTransitionEvent(),
    animationEnd = whichAnimationEvent();

// Returns a random integer between min (inc) and max (inc)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

// John Resig's Is Element In Viewport?
function isElementInViewport(el){
    if (typeof jQuery === 'function' && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

// Currency --> Double
function toDouble(value) {
    return Number(value.replace(/[^0-9\.-]+/g, ''));
}

// Double --> Currency
function toCurrency(value) {
    value = value.toString();
    var dollars = value.split('.')[0],
        cents = (value.split('.')[1] || '') + '00';
    dollars = dollars.split('').reverse().join('').replace(/(\d{3}(?!$)(?!-))/g, '$1,').split('').reverse().join('');
    return dollars + (cents.slice(0,2) !== '00' ? '.' + cents.slice(0,2) : '.00');
}

// Adding a custom event to $.fn.append;
// var oldAppend = $.fn.append;
// $.fn.append = function() {
//     return oldAppend.apply(this, arguments).trigger('append');
// }

/**
 * Number.prototype.format(d, w, s, c)
 *
 * @param integer d: length of decimal
 * @param integer w: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 *
 * http://jsfiddle.net/hAfMM/610/
 */
Number.prototype.money = function(d, w, s, c) {
    "use strict";
    var re = '\\d(?=(\\d{' + (w || 3) + '})+' + (d > 0 ? '\\b' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~d));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

/**
 * String.prototype.capitalizeFirstLetter(string)
 *
 * @param string string: any string
 *
 * http://stackoverflow.com/questions/1026069
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// mock up data
var income = {
    "goal": 80000.25,
    "estimate": 22250.25
};

var strat = {
    "current": {
        "stocks": 10,
        "bonds": 20,
        "multi": 30,
        "secupath": 40
    },
    "conservative": {
        "stocks": 20,
        "bonds": 20,
        "multi": 30,
        "secupath": 30
    },
    "moderate": {
        "stocks": 30,
        "bonds": 30,
        "multi": 20,
        "secupath": 20
    },
    "aggressive": {
        "stocks": 40,
        "bonds": 40,
        "multi": 10,
        "secupath": 10
    }
};

$(document).on('ready', function() {
    'use strict';

    // onTrack Spinner - Timer Interval
    window.onTrackTimer = function(callback, seconds) {
        var delta = 100;
        var onTrackTimeout = parseInt(seconds * 1000) || 3000;
        clearInterval(window.onTrackInterval);

        if (! $('body').hasClass('ontrack-graph-loading') ) {
            $('body').addClass('ontrack-graph-loading');
        }

        window.onTrackInterval = setInterval(function(){
            onTrackTimeout -= delta;
            if (onTrackTimeout <= 0) {
                clearInterval(window.onTrackInterval);
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        }, delta);
    };

    // onTrack Spinner - Show Spinner
    window.onTrackSpinTimer = null;
    window.onTrackSpinOldPos = null;
    window.onTrackSpinShow = function(element, msg, scrolling) {
        clearTimeout(window.onTrackSpinTimer);
        window.onTrackSpinTimer = null;

        if (! $('body').hasClass('ontrack-graph-loading') ) {
            $('body').addClass('ontrack-graph-loading');
        }

        if (typeof element === 'undefined') {
            console.log('Error, missing or wrong parameters');
            return;
        }

        var $element = $(element);
        if ($element.length === 0) {
            console.log('Error, element not found');
            return;
        }

        if (typeof msg === 'undefined') {
            msg = 'Re-calculating';
        }

        if (typeof scrolling === 'undefined') {
            scrolling = true;
        }

        // Saves initial CSS 'position' of the element
        if (window.onTrackSpinOldPos === null) {
            window.onTrackSpinOldPos = $element.css('position');
        }

        // Create new spinner and show toast if there are no spinner
        if ($element.find('.ontrack-spin').length === 0) {
            window.onTrackToast();

            var $spinner = $('<div class="ontrack-spin">' +
                            '<div class="ontrack-spin-inner align-center">' +
                            '<span class="title">'+ msg +'</span>' +
                            '<span class="text-small">Please wait...</span>' +
                            '</div>' +
                            '</div>');

            $element
                .css('position', 'relative')
                .append($spinner);

            $spinner
                .css({
                    top: 1,
                    left: 1,
                    width: $element.outerWidth() - 2,
                    height: $element.outerHeight() - 2
                })
                .fadeIn(500);
        }
    };

    // onTrack Spinner - Hide Spinner
    window.onTrackSpinHide = function(element, seconds, callback) {
        if (typeof element === 'undefined') {
            console.log('Error, missing or wrong parameters');
            return;
        }

        var $element = $(element);
        if ($element.length === 0) {
            console.log('Error, element not found');
            return;
        }

        // Spinner duration in seconds
        if (!seconds || isNaN(seconds)) {
            seconds = 0;
        }
        var s = seconds * 1000;

        window.onTrackSpinTimer = setTimeout(function() {
            $element
            .find('.ontrack-spin')
            .fadeOut(500, function(){
                $element
                    .css('position', window.onTrackSpinOldPos)
                    .find('.ontrack-spin')
                    .remove();

                clearTimeout(window.onTrackSpinTimer);
                window.onTrackSpinTimer = null;
                window.onTrackSpinOldPos = null;

                $('body').removeClass('ontrack-graph-loading');
            });

            if (callback && typeof callback === 'function') {
                callback();
            }

        }, s);
    };

    // onTrack Toast
    window.onTrackToast = function(elementToScroll, msg) {

        clearTimeout(timer);
        var timer = null;

        var $toastParent = $('.page-container');
        if ($toastParent.length === 0) {
            console.log('Toast parent not found');
            return;
        }

        if (elementToScroll === null || typeof elementToScroll === 'undefined') {
            elementToScroll = '.display-spinner';
        }

        var $elementToScroll = $(elementToScroll);
        if ($elementToScroll.length === 0) {
            console.log('Error, element to scroll not found');
            return;
        }

        if (typeof msg === 'undefined') {
            msg = 'Your new potential forecast is available. <strong>Click here</strong> to see the results.';
        }

        // If there's no toaster...
        if ($('body').find('.toast-container').length === 0) {
            var topPos,
                $toastContainer = $('<div class="toast-container">' +
                                '<span class="toast-inner">' +
                                '<span class="glyphicon glyphicon-ok" role="presentation"></span>' +
                                '<span>'+ msg +'</span>' +
                                '</div>');

            // Check if full Header + black bar is visible
            if (isElementInViewport($('header'))) {
                topPos = 135;
            } else {
                topPos = 15;
            }

            // Custom event
            $toastParent.on('appended', $toastContainer, function() {
                setTimeout(function(){
                    $toastParent
                        .find('.toast-container')
                        //.css({ opacity: 1, display: 'block' });
                        .fadeIn(500);
                }, 100);
            });

            // Clicking on toaster
            $toastParent.on('click', '.toast-container', function(){
                if ($(this).hasClass('alert-error')) {
                    clearTimeout(timer);
                    timer = null;
                    $('body .toast-container')
                        .fadeOut(500, function(){
                            $(this).remove();
                        });
                    $toastParent.off('click', '.toast-container', false);
                    return;
                }

                // Scroll to spinner position
                $('html,body')
                    .animate({
                        scrollTop: $elementToScroll.offset().top - 15
                    }, 500)
                    .promise()
                    .then(function() {
                        clearTimeout(timer);
                        timer = null;
                        $('body .toast-container')
                            .fadeOut(500, function(){
                                $(this).remove();
                            });
                        $toastParent.off('click', '.toast-container', false);
                    });
            });

            // Append the toast
            $toastParent
                .append($toastContainer)
                .trigger('appended');

            // Vertical position
            $toastContainer.css('top', topPos);

            // Hide the toast after X seconds
            timer = setTimeout(function(){
                $('body .toast-container')
                    .fadeOut(500, function(){
                        $(this).remove();
                    });
                $toastParent.off('click');
            }, 60000);

        }
    };

    // Income Chart Controller - Forecast (Your Retirement Outlook)
    function incomeChartCtrl(percentage, period) {
        var $forecast = $('.forecast');
        percentage = percentage || 0;
        period = period || 'monthly';

        $forecast
            .find('.income-chart')
            .each(function(){

                var $chart = $(this),
                    $tableMonthly = $chart.closest('.row').find('#income-table-monthly'),
                    $tableAnnual = $chart.closest('.row').find('#income-table-annual'),
                    $forecastImage = $('#forecast-outlook img'),
                    $forecastText = $('#forecast-outlook span'),
                    forecastImage,
                    forecastText;

                if (isNaN(income.estimate) || isNaN(income.goal)) {
                    console.log('Income data error');
                    return;
                }

                var estimate = income.estimate,
                    goal = income.goal,
                    gap = goal - estimate,
                    ratio = (estimate * 100) / goal;

                // Mock up calculation!
                if (percentage !== 0) {
                    estimate = estimate + ((estimate * percentage) / 100);
                    gap = goal - estimate;
                    ratio = (estimate * 100) / goal;
                }

                // Using the same tooltip as Bootstrap's, with some minor changes
                var $tooltip = $('<div class="tooltip top" role="tooltip">' +
                                '<div class="tooltip-arrow"></div>' +
                                '<div class="tooltip-inner">$'+ parseInt(estimate/1000, 10) +'k</div>' +
                                '</div>');

                $chart.find('.estimate').text('$' + parseInt(estimate/1000, 10) + 'k');
                $chart.find('.goal').text('$' + parseInt(goal/1000, 10) + 'k');

                $chart
                    .find('.range .estimate')
                    .css('opacity', 1)
                    .html($tooltip)
                    .find($tooltip)
                    .css({
                        left: '100%',
                        marginLeft: 0 - ($tooltip.outerWidth() / 2) - 2.5 // 2.5 = half the triangle
                    });

                if (estimate > goal) {
                    console.log('Estimate is greater than goal');
                    $chart
                        .find('.estimate')
                        .css({
                            width: '100%'
                        });
                } else {
                    $chart
                        .find('.estimate')
                        .css({
                            width: (period == 'monthly' ? ratio : ratio * 1.2) + '%'
                        });
                }

                $forecast
                    .find('#forecast-percentage')
                    .text(parseInt(ratio, 10) + '%');

                // Monthly
                $tableMonthly.find('.estimate').text('$' + toCurrency(Math.ceil(estimate / 100) * 100));
                $tableMonthly.find('.goal').text('$' + toCurrency(Math.ceil(goal / 100) * 100));
                $tableMonthly.find('.gap').text('$' + toCurrency(Math.ceil(gap / 100) * 100));

                // Annual
                $tableAnnual.find('.estimate').text('$' + toCurrency(Math.ceil(estimate * 2 / 100) * 100));
                $tableAnnual.find('.goal').text('$' + toCurrency(Math.ceil(goal * 2 / 100) * 100));
                $tableAnnual.find('.gap').text('$' + toCurrency(Math.ceil(gap * 2 / 100) * 100));

                // Change images dependending on ratio
                /*
                   > 105%      = Sunny and above goal
                   95 – 104.9% = Sunny at or near goal
                   80% - 94.9% = Partly Sunny
                   65-79.9%    = Cloudy
                   < 65%       = Rainy
                */
                if (ratio < 65) {
                    forecastImage = 'rainy';
                    forecastText = 'Rainy';
                } else if (ratio >= 65 && ratio < 79.9) {
                    forecastImage = 'cloudy';
                    forecastText = 'Cloudy';
                } else if (ratio >= 80 && ratio < 94.9) {
                    forecastImage = 'partly-sunny';
                    forecastText = 'Partly Sunny';
                } else {
                    forecastImage = 'sunny';
                    forecastText = 'Sunny';
                }

                $forecastText.text(forecastText);
                $forecastImage.attr('src', '../../images/' + forecastImage + '-notext.png');
            });
    }

    // Render initial chart data
    incomeChartCtrl(1);

    // Update Breakdown Table - Choose a New Investment Strategy
    function updateBreakdown() {
        var $stratStocks = $('.strat-stocks'),
            $stratBonds = $('.strat-bonds'),
            $stratMulti = $('.strat-multi'),
            $stratSecupath = $('.strat-secupath');

        // Send request
        requestUpdateStrategy();

        // Mock up - get chosen strategy value + percentage according to strategy chosen
        var chosenStrat = $('input[name=chkStrat]:checked').val(),
            stratChoice,
            percentage;

        switch(chosenStrat) {
            case 'current':
                stratChoice = strat.current;
                percentage = 1;
                break;
            case 'conservative':
                stratChoice = strat.conservative;
                percentage = 1.25;
                break;
            case 'moderate':
                stratChoice = strat.moderate;
                percentage = 1.5;
                break;
            case 'aggressive':
                stratChoice = strat.aggressive;
                percentage = 1.75;
                break;
            default:
                stratChoice = strat.current;
        }

        // Mock up ajax call to refresh the breakdown ASAP
        setTimeout(function(){
            $stratStocks.text(parseInt(stratChoice.stocks * percentage) + '%');
            $stratBonds.text(parseInt(stratChoice.bonds * percentage) + '%');
            $stratMulti.text(parseInt(stratChoice.multi * percentage) + '%');
            $stratSecupath.text(parseInt(stratChoice.secupath * percentage) + '%');
        }, 1000);

        // Return something
        return percentage;
    }

    // Send a minor request to the servlet
    function requestUpdateStrategy() {
        var chosenStrat = $('input[name=chkStrat]:checked').val() || '',
            updateType = 'strategy',
            retirementAge = $('#desired-age').val(),
            riskPreference = chosenStrat.capitalizeFirstLetter();

        console.log('');
        console.log('--- minor request ---');
        // console.log('updateType', updateType);
        // console.log('riskPreference', riskPreference);
        // console.log('retirementAge', retirementAge);
    }

    // Send a full request to the servlet
    function requestUpdateOutlook() {
        var chosenStrat = $('input[name=chkStrat]:checked').val() || '',
            updateType = 'outlook',
            riskPreference = chosenStrat.capitalizeFirstLetter(),
            retirementAge = $('#desired-age').val(),
            savingsRateIncrease = parseInt($('#savings-rate').val() - $('#savings-rate').data('initial-value')), //delta of the value of the slider and current value (can be negative)
            retirementIncomeGoal = $('#retirement-income-goal').val(),
            autoIncrease = $('#auto-increase').is(':checked') ? "yes" : "no";

        console.log('');
        console.log('--- full request ---');
        // console.log('updateType', updateType);
        // console.log('riskPreference', riskPreference);
        // console.log('retirementAge', retirementAge);
        // console.log('savingsRateIncrease', savingsRateIncrease);
        // console.log('retirementIncomeGoal', retirementIncomeGoal);
        // console.log('autoIncrease', autoIncrease);
    }

    // Choose to Save More - Table Calculations
    (function(){
        var $table = $('#forecast-table'),
            $input = $table.find('input'),
            $forecastImpact = $table.find('#forecast-impact'),
            $forecastImage = $forecastImpact.find('#forecast-image'),
            $forecastText = $forecastImpact.find('#forecast-text'),
            $forecastOutput = $forecastImpact.find('#forecast-output');

        // Keep a record of initial data
        $input.each(function(index, el) {
            var value = $(el).val(),
                newValue;

            // Normalize values to currency or number
            if ($(el).hasClass('currency')) {
                newValue = toCurrency(toDouble(value));
                $(el).val(newValue);
                $(el).data('real-value', newValue);
            } else {
                newValue = toDouble(value);
                $(el).val(newValue);
                $(el).data('real-value', newValue);
            }
        });

        $input.on('blur', function() {
            var data = [],
                $spinnerContainer = $('.display-spinner'),
                value = $(this).val();

            // Data changed?
            if ($(this).data('real-value') !== value && value !== '') {

                if ($(this).hasClass('currency')) {
                    $(this).val(toCurrency(toDouble(value)));
                    $(this).data('real-value', toCurrency(toDouble(value)));
                } else {
                    $(this).val(toDouble(value));
                    $(this).data('real-value', toDouble(value));
                }

                // Maybe we can use this later
                $input.each(function(index, el) {
                    data.push($(el).val());
                });

                // Immediatelly show the spinner
                window.onTrackSpinShow($spinnerContainer, 'Calculating forecast', false);

                // Start timer then show new "data"
                window.onTrackTimer(function(){
                    window.onTrackSpinHide($spinnerContainer, null, function(){
                        showForecast(data);
                    });
                }, 3);

            } else {

                $(this).val($(this).data('real-value'));

            }
        });

        // Mock up calc
        function showForecast(data) {

            var average = getRandomInt(1,100),
                forecastImage,
                forecastText;

            if (average < 25) {
                forecastImage = 'rainy';
                forecastText = 'Rainy';
            } else if (average >= 25 && average < 50) {
                forecastImage = 'cloudy';
                forecastText = 'Cloudy';
            } else if (average >= 50 && average < 75) {
                forecastImage = 'partly-sunny';
                forecastText = 'Partly Sunny';
            } else {
                forecastImage = 'sunny';
                forecastText = 'Sunny';
            }

            var mockNum = [];
            for (var i = 0; i <= 2; i++) {
                mockNum.push(Math.ceil(getRandomInt(30000,90000) / 100) * 100);
            }

            $forecastOutput
                .find('td:last-child')
                .each(function(index, el) {
                    // $(el).text('$' + mockNum[index].money());
                    $(el).text('$' + toCurrency(mockNum[index]));
                });

            $forecastText.text(forecastText);
            $forecastImage.attr('src', '../../images/' + forecastImage + '-notext.png');
        }
    }());

    // Modeling Area - Choose to Save More - Auto increase by 2% checkbox
    (function() {
        var $input = $('#auto-increase');

        $input
            .on('click', function() {
                var percentage = 2;
                var $spinnerContainer = $('.display-spinner');

                // Immediatelly show the spinner
                window.onTrackSpinShow($spinnerContainer, 'Calculating auto increase', false);

                // Start timer then show new "data"
                window.onTrackTimer(function(){
                    window.onTrackSpinHide($spinnerContainer, null, function(){
                        incomeChartCtrl(percentage + (percentage / 3));
                    });
                }, 5);
            });
    }());

    // Modeling Area - Choose to Save More - Preset (5%, 8%, 11%)
    (function() {
        var $input = $('.pre-forecast input[type=radio]'),
            $output = $('#pre-savings-rate-display');

        $input
            .on('click', function() {
                var percentage = $(this).val();
                var $spinnerContainer = $('.display-spinner');

                $output
                    .val(percentage + '%')
                    .next() // the slider
                    .val(percentage);

                // Immediatelly show the spinner
                window.onTrackSpinShow($spinnerContainer, 'Calculating pre forecast', false);

                // Start timer then show new "data"
                window.onTrackTimer(function(){
                    window.onTrackSpinHide($spinnerContainer, null, function(){
                        incomeChartCtrl(percentage + (percentage / 3));
                    });
                }, 5);
            });
    }());

    // Modeling Area - Choose a New Investment Strategy
    (function() {
        var $input = $('input[name=chkStrat]');
        $input
            .on('click', function() {
                // Update breakdown
                var percentage = updateBreakdown();

                var $spinnerContainer = $('.display-spinner');

                // // Start 3 seconds timer - leaving here for future reference
                // window.onTrackTimer(function(){
                //     window.onTrackSpinShow($spinnerContainer, 'Calculating chosen strategy', false);
                //     //window.onTrackToast();

                //     // Send request
                //     requestUpdateOutlook();

                //     // Mock up ajax call
                //     setTimeout(function(){
                //         window.onTrackSpinHide($spinnerContainer, null, function(){
                //             console.log('choose new strategy callback');
                //             incomeChartCtrl(percentage);
                //         });
                //     }, 5000);
                // });

                // Immediatelly show the spinner
                window.onTrackSpinShow($spinnerContainer, 'Calculating chosen strategy', false);

                // Start timer then show new "data"
                window.onTrackTimer(function(){
                    requestUpdateOutlook();
                    window.onTrackSpinHide($spinnerContainer, null, function(){
                        incomeChartCtrl(percentage + (percentage / 3));
                    });
                }, 5);
            });
    }());

    // Modeling Area - Sliders + Sibling Output/Input
    (function() {
        $('input[type=range]')
            .each(function(idx, el) {

                var $input = $(el),
                    $output = $('#' + $input.data('output')) || null,
                    prefix = $input.data('prefix') || '',
                    suffix = $input.data('suffix') || '',
                    pips = $input.data('pips'),
                    curValue = parseInt($input.val(), 10) || 0,
                    minValue = parseInt($input.attr('min'), 10) || 0,
                    minCapValue = parseInt($input.data('min-cap'), 10) || null,
                    maxValue = parseInt($input.attr('max'), 10) || 100,
                    maxCapValue = parseInt($input.data('max-cap'), 10) || null,
                    stepValue = parseInt($input.attr('step'), 10) || 100,
                    $handle,
                    tooltipSide = '';

                // set the last value
                $input.data('last-value', curValue);

                // tooltip position
                if ($input.data('tooltip-position') === 'left' && $input.data('orientation') === 'vertical') {
                    tooltipSide = ' left';
                } else if ($input.data('tooltip-position') !== 'left' && $input.data('orientation') === 'vertical') {
                    tooltipSide = ' right';
                } else {
                    tooltipSide = ' top';
                }

                // Using the same tooltip as Bootstrap's, with some minor changes
                var $tooltip = $('<div class="handle-tooltip tooltip'+ tooltipSide +'" role="tooltip">' +
                                '<div class="tooltip-arrow"></div>' +
                                '<div class="tooltip-inner">'+ prefix + curValue + suffix +'</div>' +
                                '</div>');

                // Create first tooltip
                function createTooltip() {
                    var tooltipActive = $input.data('tooltip-active');

                    if (!tooltipActive) {
                        return;
                    }

                    $handle = $input.next().find('.ui-slider-handle');
                    $handle.after($tooltip);
                    updateTooltip(curValue, minValue, maxValue);
                }

                // Update on resize
                $(window).on('resize', $input, function(e) {
                    e.preventDefault();
                    if (interval) { clearInterval(interval); }
                    var interval = setInterval(function() {
                        updateTooltip($input.data('last-value'), minValue, maxValue);
                    }, 500);
                });

                // Update tooltip
                function updateTooltip(value, minValue, maxValue, element, updateText) {
                    var $element;

                    if (typeof arguments[3] !== 'undefined') {
                        $element = $(arguments[3]);
                    } else {
                        $element = $input;
                    }

                    var prefix = $element.data('prefix') || '',
                        suffix = $element.data('suffix') || '';

                    $handle = $element.next().find('.ui-slider-handle');
                    $tooltip = $handle.next('.handle-tooltip');

                    var trackWidth = $element.next().width(),
                        trackHeight = $element.next().height(),
                        range = maxValue - minValue,
                        ratioHor = trackWidth / range,
                        ratioVer = trackHeight / range,
                        tooltipPos = 0;

                    if (arguments[4]) {
                        var newPrefix = $element.data('prefix') || '',
                            newSuffix = $element.data('suffix') || '',
                            newText = newPrefix + value + newSuffix;

                        $tooltip.find('.tooltip-inner').html(newText);
                    }

                    if ($element.data('orientation') !== 'vertical') {
                        tooltipPos = (value - minValue) * ratioHor;
                        $handle
                            .next('.handle-tooltip')
                            .css({
                                left: parseInt(tooltipPos, 10),
                                marginLeft: parseInt(($tooltip.outerWidth() / 2 * -1) + 5, 10) // 5 = half the triangle
                            });
                    } else {
                        tooltipPos = (value - minValue) * ratioVer;
                        if ($element.data('tooltip-position') === 'left') {
                            $handle
                                .next('.handle-tooltip')
                                .css({
                                    right: 0,
                                    bottom: tooltipPos
                                });
                        } else {
                            $handle
                                .next('.handle-tooltip')
                                .css({
                                    left: 0,
                                    bottom: tooltipPos
                                });
                        }
                    }
                }

                // Update original input and optional output (if any)
                function updateOutput(event, ui) {
                    curValue = ui.value;

                    // Keep the value of the input[type=range] in sync with the slider
                     $input.val(curValue);

                    // Update output with value from slider (this is just for display! not to submit!)
                    if ($output.length > 0) {
                        $output
                            .val(curValue + suffix)
                            .data('last-value', curValue);
                    }
                }

                // Update forecast chart after slide
                function updateForecast(event, ui) {
                    curValue = ui.value;

                    if (curValue !== $input.data('last-value')) {
                        var retirementIncomeGoal = $('#retirement-income-goal').val(),
                            retirementAge = $('#desired-age').val();

                        var $spinnerContainer = $('.display-spinner');

                        // Mock up get chosen strategy value
                        var percentage = updateBreakdown();

                        // Mock up calculation
                        var newValue = curValue * (retirementAge/100 + retirementIncomeGoal/100) * percentage;

                        // Immediatelly show the spinner
                        window.onTrackSpinShow($spinnerContainer, 'Calculating new range', false);

                        // Start timer then show new "data"
                        window.onTrackTimer(function(){
                            requestUpdateOutlook();

                            window.onTrackSpinHide($spinnerContainer, null, function(){
                                incomeChartCtrl(newValue);
                            });
                        }, 5);
                    }
                }

                // Update the range value(s) and its tooltip
                function updateInput(curValue) {
                    maxValue = $slider.slider('option', 'max');
                    minValue = $slider.slider('option', 'min');
                    stepValue = $slider.slider('option', 'step');
                    curValue = parseInt(curValue, 10);

                    if (isNaN(curValue)) {
                        console.log('updateInput(): NaN - returning');
                        $input.val($input.data('last-value'));
                        return;
                    }

                    // Dynamically change max value if user decides so, AND if there's no hard cap
                    if (curValue > maxValue) {
                        maxValue = curValue;
                        $input.attr('max', maxValue);
                    }

                    // Update the slider
                    $slider
                        .slider('option', {
                            'min': minValue,
                            'max': maxValue,
                            'value': curValue
                        });

                    // Keep the value of the input[type=range] in sync with the slider
                    $input.val(curValue);

                    // Update the tooltip
                    updateTooltip($input.data('last-value'), minValue, maxValue);
                }

                // Update the slider/tooltip/output combo
                window.updateSlider = function(newValue, newMin, newMax, element, updateText) {
                    if (arguments.length === 0) { return; }
                    if (typeof arguments[3] === 'undefined') { return; }

                    var $el = $(element),
                        $display = $('#' + $el.data('output'));

                    var newPrefix = $el.data('prefix') || '',
                        newSuffix = $el.data('suffix') || '';

                    $el
                        .val(newValue)
                        .attr({ min: newMin, max: newMax })
                        .data({ 'initialValue': newValue, 'lastValue': newValue });

                    $display
                        .val(newValue + newSuffix)
                        .attr({ min: newMin, max: newMax})
                        .data({ 'lastValue': newValue, 'min': newMin, 'max': newMax })
                        .next()
                        .val(newValue)
                        .data('initialValue', newValue);

                    $el
                        .next()
                        .slider('option', { min: newMin, max: newMax, value: newValue });

                    if (pips) {
                        $el.slider('pips', 'refresh');
                    }

                    updateTooltip(newValue, newMin, newMax, element, updateText);
                };

                // Create a new div, turn it into a slider, and set its attributes based on
                // the attributes of the input. If the input doesn't possess those attributes
                // use jQuery UI's defaults
                var $slider = $('<div />');

                // Append the slider after the input and hide the input. The user will only interact with the slider
                $input
                    .after($slider)
                    .hide();

                // Init jQueryUI Slider
                $slider
                    .slider({
                        animate: false,
                        disabled: $input.prop('disabled'),
                        range: "min",
                        min: parseInt($input.attr('min'), 10) || 0,
                        max: parseInt($input.attr('max'), 10) || 100,
                        value: parseInt($input.attr('value'), 10) || 0,
                        step: parseInt($input.attr('step'), 10) || 1,
                        orientation: $input.data('orientation') || 'horizontal',
                        slide: updateOutput,
                        stop: function(event, ui) {
                            var callBack = $input.data('on-slider-stop') || 'requestUpdateOutlook',
                                functionToCall = window[callBack];
                            if (typeof functionToCall === 'function') {
                                functionToCall.call();
                            }
                        },
                        change: function(event,ui) {
                            var thisValue = $(ui).parent().prev('input').val();
                            updateTooltip(thisValue, minValue, maxValue);
                        },
                        create: function() {
                            createTooltip($input.data('last-value'), minValue, maxValue);
                        }
                    });

                // check for pips
                if (pips) {
                    $slider.slider('pips', {
                        first: 'pip',
                        last: 'pip',
                        //step: 1,
                        prefix: '',
                        suffix: ''
                    });
                }

                // init touch - for mobile
                $slider.draggable();

                // Slider output
                if ($output.length > 0) {
                    // Set initial values of the output
                    $output
                        .val($input.val() + suffix)
                        .data({ 'lastValue': curValue, 'minCap': minCapValue, 'maxCap': maxCapValue });

                    // Add listeners to output
                    $output
                        .on('focus', function() {
                            curValue = $output.data('last-value'); // retrieve last value for this input
                            $(this).val(curValue);
                        })
                        .on('keypress', function(e) {
                            if (e.which === 13){
                                e.preventDefault();
                                $(this).blur();
                            }
                        })
                        .on('change blur', function() {
                            curValue = parseInt($(this).val());

                            // Check for boundaries
                            var oMaxCapValue = $(this).data('max-cap');
                            var oMinCapValue = $(this).data('min-cap');
                            if (!isNaN(curValue) && curValue >= oMinCapValue) {
                                if (oMaxCapValue !== null && curValue > oMaxCapValue) {
                                    console.log('over max cap, returning');
                                    $output.val($output.data('last-value') + suffix);
                                    return;
                                }
                                if (curValue > $input.attr('max')) {
                                    $input.attr('max', curValue);
                                }
                            } else {
                                $output.val($output.data('last-value') + suffix);
                                return;
                            }

                            // display new value
                            $output.val(curValue + suffix);

                            if (curValue !== $output.data('last-value')) {
                                var $spinnerContainer = $('.display-spinner');
                                var percentage = updateBreakdown();

                                // Immediatelly show the spinner
                                window.onTrackSpinShow($spinnerContainer, 'Calculating new range', false);

                                // Start timer then show new "data"
                                window.onTrackTimer(function(){
                                    var callBack = $output.data('outlook-function') || 'requestUpdateOutlook',
                                    functionToCall = window[callBack];
                                    if (typeof functionToCall === 'function') {
                                        functionToCall.call();
                                    }

                                    window.onTrackSpinHide($spinnerContainer, null, function(){
                                        incomeChartCtrl(curValue * percentage);
                                    });
                                }, 5);

                                $output.data('last-value', curValue); // store current value of this input
                                updateInput(curValue); // updates the slider input
                            }
                        });
                }
            });
    }());

    // Modeling Area - View By Monthly/Annual
    (function(){
        var tab = $('#view-by label'),
            tabs = $('#view-by table');

        tab.on('click', function(e) {
            e.preventDefault();
            var value = $(this).find('input').val();
            var tabActive = $('#income-table-' + value);
            tabs.hide();
            tabActive.removeClass('hidden').fadeIn();

            // Mock up calc
            switch(value) {
                case 'monthly':
                    incomeChartCtrl(1);
                    break;
                default:
                    incomeChartCtrl(1,'annual');
            }
        });

    }());
});
