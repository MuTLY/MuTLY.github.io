/* current BS DatePicker init */
$(function() {
    'use strict';

    // Init BS DatePicker ONLY if it's not a mobile device
    if (!isMobile.any()) {
        var $datePicker = $('.input-group.date input[type=date]');

        $datePicker
            .not(':disabled')
            .not('[readonly]')
            .on('focus', function(e) {
                $(this).data('old-value', $(this).val()); // store the current value
            })
            .on('blur', function(e) {
                if ($(this).data('old-value') !== $(this).val() && $(this).val() !== '') {
                    // Skip validation when the browser supports the format fully natively
                    if (Modernizr.inputtypes.date) {
                        //$(this).data('date-normalized', $(this).val());
                        return;
                    }

                    // Set date normalized data and update the datepicker
                    var value = $.trim($(this).val());
                    /*
                    if (isValidDateLocale(value)) {
                        $(this).val(value); // set the value in the mm/dd/yyyy format
                        $(this).data('date-normalized', formatDateISO(value)); // set the normalized value
                        $(this).parent().datepicker('update', value); // update the datepicker
                    }
                    */
                    $(this).parent().datepicker('update', value); // update the datepicker
                } else {
                    $(this).val($(this).data('old-value'));
                }
            });

        // Set BS datepicker defaults
        $.fn.datepicker.dates.en = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            format: "mm/dd/yyyy",
            titleFormat: "MM yyyy",
            weekStart: 0
        };

        var format,
            startDate,
            endDate;

        // Using native input attributes (it should all be ISO format yyyy-mm-dd)
        startDate = $datePicker.attr('min');
        endDate = $datePicker.attr('max');

        // Converting strings if needed
        if (Modernizr.inputtypes.date) {
            // input[type=date] support
            format = 'yyyy-mm-dd';
            //$datePicker.data('date-normalized', $datePicker.val()); // set the normalized value
        } else {
            // NO input[type=date] support
            format = 'mm/dd/yyyy';
            // Format dates
            /*
            startDate = formatDateLocale(startDate);
            endDate = formatDateLocale(endDate);
            $datePicker.data('date-normalized', $datePicker.val()); // set the normalized value first! It should be ISO right from the start on the input field itself!
            $datePicker.val(formatDateLocale($datePicker.val())); // change the value string
            */
        }

        var datePickerOptions = {
            autoclose: true,
            todayHighlight: true,
            format: format,
            //orientation: 'bottom left',
            //startDate: startDate,
            //endDate: endDate,
            //disableTouchKeyboard: true,
            enableOnReadonly: false,
            showOnFocus: false
        };

        $datePicker
            .not(':disabled')
            .not('[readonly]')
            .parent()
            .datepicker(datePickerOptions);

        var disableDatepicker = function($el, state) {
            if (typeof $el !== 'undefined' && typeof state !== 'undefined') {
                $el = $(arguments[0]);
                state = arguments[1] === true || arguments[1] === false ? arguments[1] : null;

                if ($el.length === 0 || state === null) {
                    console.log('Missing or wrong parameters.');
                    return;
                }

                $el
                    .attr({
                        'disabled': state,
                        'readonly': state
                    })
                    .prop({
                        'disabled': state,
                        'readonly': state
                    })
                    .datepicker(datePickerOptions);
            } else {
                console.log('Missing parameters.');
            }
        };
        window.disableDatepicker = disableDatepicker;

    } // end if !mobile

});
