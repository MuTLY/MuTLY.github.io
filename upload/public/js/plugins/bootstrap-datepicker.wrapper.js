/* boootstrap-datepicker plugin wrapper
 *
 * Dependencies: jQuery, Bootstrap, MomentJS, jQuery Mask Plugin
 * Devs: Leandro Barbosa, Gustavo Schonarth - SENTA A PÚA!
 * 2017-03-30
 */
// Inside its own scope so we don't break stuff outside of it
// on DOM ready...
$(function() {
    // Check for mobile - This is here too because the globalFooter one is initialized after it.
    var isMobile = {
        Android: function() {
            'use strict';
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            'use strict';
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            'use strict';
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            'use strict';
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            'use strict';
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            'use strict';
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };

    // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
    function isValidDateUS(dateString) {
        'use strict';

        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
            return false;
        }

        // Parse the date parts to integers
        var parts = dateString.split('/');
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month === 0 || month > 12) {
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }

    // Validates that the input string is a valid date formatted as "yyyy-mm-dd"
    function isValidDateISO(dateString) {
        'use strict';

        // First check for the pattern
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return false;
        }

        // Parse the date parts to integers
        var parts = dateString.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var day = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month === 0 || month > 12) {
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }

    // Every input should be type=date by default (mobile), and values should follow the ISO format YYYY-MM-DD
    // When on mobile, the device itself will take care of the user interaction
    // The JSTL component is taking care of rendering the inital values in the ISO format
    // If you don't want to initialize the datepicker on a specific input field, add the CSS class 'no-bs-datepicker' to it
    var $datePicker = $('.input-group.date input[type=date]:not(.no-bs-datepicker)');

    // Abort if date picker not found on page
    if ($datePicker.length === 0) {
        return;
    }

    // Let's put the current date in a MomentJS object for future use
    var currentDate = moment();

    // Create the hidden input for both desktop and mobile
    // All of the values for the attributes value, min and max are on ISO string format by default
    $datePicker
        .each(function(index, element) {
            var $el = $(element),
                val = $el.val(), // it is ISO string by default (or '')
                $hid = $('<input class="bsdp-hidden-value" type="hidden" value="" name="'+ $el.attr('name') +'" data-input-format="date" data-initial-value="' + val + '" data-old-value="' + val + '">'),
                returnFormat = $el.data('return-format') ? $el.data('return-format').toUpperCase() : 'YYYY-MM-DD'; // return format we want for the back end (default is YYYY-MM-DD)

            // set hidden field value string in the return format - the actual field that's gonna be submitted
            if (val) {
                $hid.val( moment(val, 'YYYY-MM-DD').format(returnFormat) );
            }

            // normalize input attributes so we have min and max strings
            if (!$el.attr('min')) {
                $el.attr('min', moment(currentDate).subtract(100, 'years').format('YYYY-MM-DD'));
            }
            if (!$el.attr('max')) {
                $el.attr('max', moment(currentDate).add(100, 'years').format('YYYY-MM-DD'));
            }

            $el.data({
                'old-val': val,
                'old-min': $el.attr('min'),
                'old-max': $el.attr('max')
            });

            // add the hidden input field after the datepicker component
            $el
                .removeAttr('name')
                .parent()
                .after($hid);
        });

    // Custom handler to catch changes on input field values (value, min, max attributes)
    // Needs to be triggered manually if needed. E.g., used with the dateRangePicker.
    window.updateDatePicker = function() {
        // vars
        var $el = $(this),
            $hid = $el.parent().siblings('input[type=hidden].bsdp-hidden-value'),

            oldVal = $el.data('old-val'), // can be '' or ISO string
            oldMin = $el.data('old-min'), // it is ISO string
            oldMax = $el.data('old-max'), // it is ISO string

            newVal = $el.val(), // can be '' or ISO string
            newMin = $el.attr('min'), // it is ISO string
            newMax = $el.attr('max'), // it is ISO string

            returnFormat = $el.data('return-format') ? $el.data('return-format').toUpperCase() : 'YYYY-MM-DD'; // return format we want for the back end (default is YYYY-MM-DD)

        // normalize to ISO string
        if (newVal !== '') {
            newVal = isDatePicker ? moment(newVal, 'MM/DD/YYYY').format('YYYY-MM-DD') : moment(newVal, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }

        // checking for changes on strings
        if (newVal !== '' && (newVal !== oldVal || newMin !== oldMin || newMax !== oldMax)) {
            // set moment objects
            newVal = isDatePicker ? moment($el.val(), 'MM/DD/YYYY') : moment($el.val(), 'YYYY-MM-DD');
            newMin = moment($el.attr('min'), 'YYYY-MM-DD');
            newMax = moment($el.attr('max'), 'YYYY-MM-DD');

            $el.data({
                'old-val': moment(newVal).format('YYYY-MM-DD'),
                'old-min': moment(newMin).format('YYYY-MM-DD'),
                'old-max': moment(newMax).format('YYYY-MM-DD')
            });

            $el.attr({
                'min': moment(newMin).format('YYYY-MM-DD'),
                'max': moment(newMax).format('YYYY-MM-DD')
            });

            // update the hidden field value in the return format for the back end
            $hid.val(moment(newVal).format(returnFormat)).trigger('change');

            // update the visual field
            $el
                .val(moment(newVal).format('MM/DD/YYYY'))
                .parent()
                .datepicker('setStartDate', moment(newMin).format('MM/DD/YYYY'))
                .datepicker('setEndDate', moment(newMax).format('MM/DD/YYYY'))
                .datepicker('update');
        }
    };

    // checking dates
    var timer;
    function checkDate(el, event) {
        var $el = $(el),
            val = $el.val(),
            msg;

        var normVal = moment(val, 'MM/DD/YYYY');

        var resetFeedback = function(status) {
            if (timer) {
                clearTimeout(timer);
            }

            $el
                .parent().removeClass('has-feedback '+ status)
                .find('.form-control-feedback').removeClass('glyphicon-'+ status)
                .off('focus.bsdp-msg select.bsdp-msg');

            $el.parent().tooltip('destroy');
        };

        var showMsg = function(msg, status) {
            // reset
            resetFeedback(status);

            // adding feedback, give it time to reset first
            setTimeout(function(){
                $el
                    .parent().addClass('has-feedback '+ status)
                    .find('.form-control-feedback').addClass('glyphicon-'+ status);

                // creating a dynamic tooltip
                $el
                    .parent()
                    .tooltip({
                        title: function() {
                            return $(this).attr('data-original-title');
                        },
                        html: true,
                        trigger: 'manual'
                    });

                $el.parent().attr('data-original-title', msg).tooltip('show');
            }, 250);

            $el.on('focus.bsdp-msg select.bsdp-msg', function() {
                resetFeedback(status); // reset on focus/select
            });

            timer = setTimeout(function(){
                resetFeedback(status); // reset after 10s
            }, 10000);
        };

        // check if date is valid and if the format is either MM/DD/YYYY or YYYY-MM-DD
        if (val === '') {
            event.preventDefault();
            return false;
        } else if (val.length > 9 && moment(normVal).isValid() && (isValidDateUS(val) || isValidDateISO(val))) {
            // check boundaries
            var min = $el.attr('min'),
                max = $el.attr('max'),
                normMin = moment(min, 'YYYY-MM-DD'),
                normMax = moment(max, 'YYYY-MM-DD');

            if ((moment(normVal).isBefore(moment(normMin), 'day')) || (moment(normVal).isAfter(moment(normMax), 'day'))) {
                msg = '<strong>Invalid date.</strong><br>Date range is '+ moment(normMin).format('MM/DD/YYYY') +' to '+ moment(normMax).format('MM/DD/YYYY');
                showMsg(msg, 'error');
                event.preventDefault();
                return false;
            }

            // update the date picker. no need to normalize, the handler will take care of it
            $el.val(val);
            $el.triggerHandler('updateDatePicker');
            return true;
        } else {
            msg = '<strong>Invalid date.</strong><br>Please type a valid date and try again.';
            showMsg(msg, 'error');
            event.preventDefault();
            return false;
        }
    }

    // Init BS DatePicker ONLY on desktop
    if (!isMobile.any()) {
        // Change the type to 'text'
        $datePicker.prop('type', 'text');

        // Set BS datepicker defaults
        var datePickerOptions = {};
        $.fn.datepicker.dates.en = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            format: "mm/dd/yyyy", // note the lower case (BS DatePicker)
            titleFormat: "MM yyyy",
            weekStart: 0
        };

        $datePicker.each(function(index, element) {
            var $el = $(element);

            // we change the element value to US date format to conform with the DatePicker defaults
            // note the upper case (MomentJS)
            if ($el.val() !== '') {
                var value = moment($el.val(), 'YYYY-MM-DD').format('MM/DD/YYYY');
                $el.val(value);
            }

            // Set options for the DatePicker - also conform with the DatePicker defaults
            var startDate = moment($el.attr('min'), 'YYYY-MM-DD').format('MM/DD/YYYY'),
                endDate = moment($el.attr('max'), 'YYYY-MM-DD').format('MM/DD/YYYY');

            // Initialize this date picker
            datePickerOptions = {
                autoclose: true,
                todayHighlight: true,
                startDate: startDate,
                endDate: endDate,
                enableOnReadonly: false,
                showOnFocus: false
            };

            $el
                .not(':disabled')
                .not('[readonly]')
                .parent()
                .datepicker(datePickerOptions);
        });

        // Set mask to US date format and digits only
        $datePicker.mask('00/00/0000');

        // Set events for all date pickers
        $datePicker
            .not(':disabled')
            .not('[readonly]')
            .on('focus mouseup', function() {
                $(this).select(); // select the whole value (easier to type again)
            });

        // set 'global' listener
        $datePicker
            .not(':disabled')
            .not('[readonly]')
            .on('updateDatePicker', updateDatePicker)
            .on('keypress', function(event) {
                if (event.which === 13) {
                    checkDate(this, event);
                }
            })
            .on('changeDate change', function(event) {
                checkDate(this, event);
            });

        // Global function to disable the date picker
        var disableDatepicker = function(el, state) {
            if (typeof el !== 'undefined' && typeof state !== 'undefined') {
                var $el = $(el);
                state = (state === true || state === false) ? state : null;

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
    }

    // DO NOT init BS DatePicker. This is mobile.
    else {
        $datePicker
            .on('change', function() {
                var $el = $(this),
                    $hid = $el.parent().siblings('input[type=hidden].bsdp-hidden-value'),
                    returnFormat = $el.data('return-format') ? $el.data('return-format').toUpperCase() : 'YYYY-MM-DD'; // return format we want for the back end (default is YYYY-MM-DD);

                // update the hidden field in the return format
                var date = $el.val();
                $hid.val(moment(date).format(returnFormat)).trigger('change');
            });
    }
});
