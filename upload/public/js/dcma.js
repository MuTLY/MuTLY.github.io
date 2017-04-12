(function ($) {

    $(ready);

    function ready() {
        $('.js-progress-unit').each(progressToggleWatch); // js-progress-toggle

        //$('#income_slider').each(initSlider);
        $('input[name="income_est"]').on('change', calToggle);
        $('#income_input').on('change', estimatedIncomeNeed);
    }

    /***** Progress Toggle separate code  *****/
    function progressToggleWatch() {
        var $scope = $(this);
        $('input[type="radio"]', $scope).on('change', annualMonthlyToggle);
    }

    function annualMonthlyToggle() {
        var $scope = $(this).closest('.js-progress-unit'),
            $annual = $('.js-annual-progress', $scope),
            $monthly = $('.js-monthly-progress', $scope);

        // original
        if ($(this).prop('checked') === true && this.value === 'monthly') {
            $monthly.show();
            $annual.hide();
        } else if ($(this).prop('checked') === true && this.value === 'annual') {
            $annual.show();
            $monthly.hide();
        }

    }
    /***** END Progress Toggle separate code  *****/
    /*
    function initSlider() {
        var $input = $(this),
            $output = $('#' + $input.data('output')) || null,
            curValue = parseInt($input.data('value')) || 0;

        $input.slider({
            animate: true,
            disabled: $input.prop('disabled'),
            range: "min",
            min: 0,
            max: 100,
            value: parseInt($input.data('value')) || 0,
            step: 1,
            slide: updateOutput,
            orientation: 'horizontal'
        }).draggable();

        function updateOutput(event, ui) {
            curValue = ui.value;

            // Keep the value of the input[type=range] in sync with the slider
            $input.val(curValue);

            // Update text input and progressbar with value from slider
            if ($output.length > 0) {
                $output
                    .val(curValue)
                    .change(); //triggers calculation
            }
        }
    }
    */

    function calToggle() {
        if ($(this).prop('checked') === true && this.value === 'annual') {
            $('.js-annual-nums').show();
            $('.js-monthly-nums').hide();
        } else if ($(this).prop('checked') === true && this.value === 'monthly') {
            $('.js-annual-nums').hide();
            $('.js-monthly-nums').show();
        }
    }

    // This needs to be reworked so it works with the current ONTRACK, default customized slider
    window.estimatedIncomeNeed = function() {
        console.log('on slider stop...');

        var currentIncomeString = $('.js-progress-current-income').text(); //will be generated from back-end and static
        var currentIncome = currencyToNum(currentIncomeString);
        var projectedIncomeString = $('.js-progress-projected-income').text();
        var projectedRetirementIncome = currencyToNum(projectedIncomeString); //will be generated from back-end

        // get progress bar attributes. might not need.
        var $progressBar = $("#retire_income_gap");
        var $progressBarGoal = $('#progress_bar_goal');
        //never used - could be stripped ..... var goalRetire = $progressBar.attr('aria-valuemax'); // changes based on slider
        var currRetire = $progressBar.attr('aria-valuenow'); // does not change
        var sliderVal = $('#income_input').val(); //pick up the change

        /*$('#income_slider').slider('option', {
            'value': sliderVal
        });*/ //reflect the change on the slider

        var retireIncomeNeed = (sliderVal / 100); // convert slider value into a math multiplier
        //do math
        var retireGoal = currentIncome * retireIncomeNeed;
        var retireProgress = projectedRetirementIncome / retireGoal;
        var retireSurplus = retireGoal / currRetire;
        var gap = retireGoal - currRetire;

        $progressBar.attr('aria-valuemax', retireGoal); //this changes by the slider
        if (retireProgress < 1) {
            $progressBar.width(retireProgress * 100 + '%');
            $progressBarGoal.width('100%');
        } else {
            $progressBar.width('100%');
            $progressBarGoal.width(retireSurplus * 100 + '%');
        }

        // apply change results back to page.
        $('.js-income-goal').text('$' + Math.round(retireGoal / 1000) + 'K');
        $('.js-income-goal-mo').text(numToCurrency(monthlyIncome(retireGoal)));

        $('.js-income-slider-result').text(sliderVal + '%');
        $('.js-progress-goal-income').text(numToCurrency(retireGoal));
        $('.js-progress-income-gap').text(numToCurrency(Math.abs(gap)));

        if (gap < 0) {
            $('.js-income-gap').text('Surplus: $' + Math.abs(Math.round(gap / 1000)) + 'K');
            $('.js-income-gap-mo').text('Surplus: ' + numToCurrency(monthlyIncome(gap)));
            $('.progress__income-gap--alert').addClass('success');

            $('.js-progress-gap__label').text('Surplus:');
            $('.js-gap-text').text('surplus');
            $('.js-income-surplus-msg').show();
            $('.js-income-gap-msg').hide();
        } else {
            $('.js-income-gap').text('$' + Math.round(gap / 1000) + 'K');
            $('.js-income-gap-mo').text(numToCurrency(monthlyIncome(gap)));
            $('.progress__income-gap--alert').removeClass('success');

            $('.js-progress-gap__label').text('Gap:');
            $('.js-gap-text').text('gap');
            $('.js-income-gap-msg').show();
            $('.js-income-surplus-msg').hide();
        }

        //$('.ui-slider-handle','#income_slider').css({'left': sliderVal});

        // update the list
        incomeConversion('.js-progress-goal-income', '.js-progress-goal-income-mo');
        incomeConversion('.js-progress-income-gap', '.js-progress-income-gap-mo');
    }

    /**** Factory functions. possible candidates for extract & reuse *****/
    function currencyToNum(string) {
        string = string;
        string = parseInt(string.replace(/[$,]+/g, ""));
        return string;
    }

    function numToCurrency(num) {
        num = num;
        var x = 3,
            n = 0;
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        num = '$' + num.toFixed(Math.max(0, ~~0)).replace(new RegExp(re, 'g'), '$&,');
        return num;
    }

    function monthlyIncome(income) {
        income = income;
        income = Math.abs(Math.round(income / 12));
        return income;
    }

    function incomeConversion(input, output) {
        var $this = $(input);
        var thisString = $this.text();
        var workingNum = currencyToNum(thisString);
        var monthlyNum = monthlyIncome(workingNum);
        var monthlyString = numToCurrency(monthlyNum);
        $(output).text(monthlyString);
    }

})(jQuery);
