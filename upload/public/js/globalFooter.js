/***************************************************************
 * REV PL
 * this file SHOULD NOT be copied over to DDOL or any other site as it is.
 * e.g. the file on DDOL is slightly modified, lacking components being tested on PL!
 * eventually both files will match when components are copied to DDOL. be careful!
 */

// Create breakpoints
var bp = {
    mobile: 736, // this is iPhone6+. It was 568 (iPhone5)
    tablet: 768,
    desktop: 992
};

Response.create({
    prop: 'width', // property to base tests on
    prefix: 'r src', // custom aliased prefixes
    breakpoints: [0, bp.tablet, bp.desktop, 1200], // custom breakpoints
    lazy: true // enable lazyloading
});

// What to do when breakpoints are crossed
Response.crossover(initBodySize, 'width');

// Fire on READY and EACH RESIZE
Response.action(function() {
    'use strict';

    // Skip IE-breaking code
    if ($('html').hasClass('ie7')) {
        return;
    }

    // function used across several pages. prevents collapsing if a user's device crosses the mobile threshold to tablet size in landscape (7" android tablets).
    $('.js-panel-2-accordion__mbl').each(mobileAccordionActions);

    // function used on all post-login pages, creates dropdown if content wider than space available.
    crumbAcctViewer();

    // Handle wide tables.
    handleWideTables();

    // Tab scrolling on smartphones
    initTabScroll();
});

// on DOM ready...
Response.ready(function() {
    'use strict';

    // TableSaw init - Tables on mobile
    $(document).trigger('enhance.tablesaw');

    // Set body class based on browser width and swap desktop and mobile nav
    initBodySize();

    // initialise popovers & tooltips globally.
    startPopovers();
    startTooltips();

    // Show/hide menu on mobile/tablet
    // Make sure it starts hidden in smaller sizes and won't leak into the page
    $('.btn--menu').on('click', function() {
        var $sidebar = $('.left_sidebar');

        // set listener
        $sidebar.on(transitionEnd, function(e) {
            if ($(e.target).is(this)) {
                if (!$sidebar.hasClass('slid')) {
                    $sidebar.addClass('hidden-xs hidden-sm');
                }
                $(this).off(transitionEnd);
            }
        });

        // slide the sidebar
        $sidebar.removeClass('hidden-xs hidden-sm');
        setTimeout(function() {
            $sidebar.toggleClass('slid'); // this class has a transition:left
        }, 250);

        if ($('body').hasClass('mobile')) {
            $('body').toggleClass('menu-is-open');
        }
    });

    // No actions on disabled buttons
    $('a, button').each(function(idx, el) {
        $(el).data('onclick', this.onclick); // store original onclick
        $(el).data('onsubmit', this.onsubmit); // store original onsubmit

        this.onclick = function(event) {
            if ($(el).attr('disabled') || $(el).hasClass('disabled')) {
                return false;
            }
            if ($(el).data('onclick')) { $(el).data('onclick').call(this, event || window.event); } // call the original event
        };

        this.onsubmit = function(event) {
            if ($(el).attr('disabled') || $(el).hasClass('disabled')) {
                return false;
            }
            if ($(el).data('onsubmit')) { $(el).data('onsubmit').call(this, event || window.event); } // call the original event
        };
    });

    // Click action with keyboard navigation
    $(document).on('keydown', 'a[role=button]', function(e) {
        var code = e.which;
        if ((code === 13) || (code === 32)) {
            $(this).click();
        }
    });

    // CTRL + A combo = show/hide WebSphere Snooper
    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode == 65) {
            e.preventDefault();
            $('.snooper').toggle();
        }
    });

    // Alternate snooper trigger for keyboard-less devices: 5 taps to the horizontal ruler right above the copyright paragraph in the footer.
    var incrementFooterCounter = (function() {
        var counter = 0;
        return function() { // closure
            if (++counter > 4) {
                $('.snooper').toggle();
                counter = 0;
            }
            window.setTimeout(function(){ // reset counter
                counter = 0;
            }, 1000);
        };
    })();
    $('footer .footer-rule').on('touchend', incrementFooterCounter);
    $('.snooper').on('touchend', incrementFooterCounter);

    // Fix page titles
    fixPageTitle();

    // Select all on input field focus
    $.fn.selectRange = function(s,e) {
        if (!s || !e) {
            s = 0;
            e = 9999;
        }
        $(this).each(function() {
            var el = $(this)[0];
            if (el) {
                el.focus();
                setTimeout(function() {
                    if (el.setSelectionRange) {
                        el.setSelectionRange(s,e);
                    } else if (el.createTextRange) {
                        var range = el.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character',e);
                        range.moveStart('character',s);
                        range.select();
                    } else if (el.selectionStart) {
                        el.selectionStart = s;
                        el.selectionEnd = e;
                    } else {
                        el.select();
                    }
                }, 1);
            }
        });
    };
    $('input.currency, input.percentage, input.age').on('focus', function() {
        $(this).selectRange();
    });

    // Fix for iOS bug when opening modal: do not scroll the background page
    if (isMobile.iOS()) {
        var mobileScrollTop = 0;

        // when you load the overlay, save the scroll position
        $('.modal').on('shown.bs.modal', function() {
            mobileScrollTop = document.querySelector("body").scrollTop;
            $('body').css('position', 'fixed');
        });

        // when you close the overlay, restore the scroll position
        $('.modal').on('hide.bs.modal', function() {
            $('body').css('position', '');
            window.scrollTo(0, mobileScrollTop);
        });
    }

    // Init Simple Responsive Tables
    initSimpleResponsiveTable();
});

// On orientation change...
$(window).on('orientationchange', function(){
    // function used on all post-login pages, creates dropdown if content wider than space available.
    crumbAcctViewer();

    // Tab scrolling on smartphones
    initTabScroll();
});

// Give the browser enough time to actually render stuff, then...
$(window).on('load', function() {
    'use strict';

    // fix sidebar on tablet/mobile
    fixSidebar();

    // function used on all post-login pages, creates dropdown if content wider than space available.
    crumbAcctViewer();

    // Set maxlength for specific "percentage" input fields
    $('input.percentage').attr('maxlength', 6);

    // Custom select dropdowns (graceful degradation IE9 and below)
    initCustomDropDown();

    // boootstrap-datepicker plugin
    // This is being initialized on the head now, through bootstrap-datepicker.wrapper.js

    // Init Scrollable Tables (uses DataTables.net)
    // initScrollableTables();

    // Handle wide tables. Make sure this happens at the end
    handleWideTables();

    // Tab scrolling on smartphones
    initTabScroll();

    // Init Accordion Tables
    initAccordionTables();

    // Initialize alternate eq height plugin
    initEqHeight();

    // Haptic feedback for mobile
    if (supportsVibrate && isMobile.any()) {
        (function initHaptics() {
            $(document).on('touchstart', '.click-action, form .btn, [role=button]', function(e) {
                e.stopImmediatePropagation();
                navigator.vibrate(0); // stops current vibration
                navigator.vibrate(35); // ms vibration
            });
            $(document).on('touchcancel touchmove', '.click-action, form .btn, [role=button]', function(e) {
                e.stopImmediatePropagation();
                navigator.vibrate(0); // stops current vibration
            });
        }());
    }
});

/***********************************************
/* General Functions / Plugins
*/
// Custom Dropdown - <SELECT>
function initCustomDropDown() {
    // Non-responsive? Do nothing!
    if ($('body').hasClass('layout-non-responsive') || $('body').attr('data-ui-compat') == 'non-responsive') {
        return;
    }

    var $select = $('select'),
        w,
        s;

    $select
        .each(function(index, el) {
            // If the select isn't wrapped, wrap it!
            if (!$(el).parent().hasClass('custom-select')) {
                if ($(el).parent().hasClass('form-group')) {
                    $(el)
                        .parent()
                        .addClass('custom-select')
                        .children()
                        .wrapAll('<span class="custom-select-inner"></span>');
                } else {
                    $(el)
                        .wrapAll('<div class="custom-select"><span class="custom-select-inner"></span></div>');
                }
            } else {
                $(el)
                    .parent()
                    .children()
                    .wrapAll('<span class="custom-select-inner"></span>');
            }

            $('select:after', $(this)).on('click', function() {
                $(this).prev('select').focus();
            }); // added 3/2/16 for IE10 bug not allowing click of carat.
        });
}

// Smartphone Tab Scrolling
function initTabScroll() {
    var $tabSwipe = $('.nav-tabs-wrapper');
        fullSize = 1;

    if ($(window).width() < 768) {
        $tabSwipe
            .each(function(index, el) {
                var $tab = $(this).find('.nav-tabs li a');
                $tab.each(function(index, el) {
                    fullSize += $(this).actual('outerWidth', { includeMargin : true }); // using jQuery.actual because hidden elements
                });
                $tab.closest('ul.nav-tabs').width(fullSize + 15); // 15px for the right "padding" on smartphones
            });
    } else {
        $tabSwipe.children('ul.nav-tabs').width('');
    }
}

// Make sidebar same height as body minus the "header"
var fixSidebar = debounce(function() {
    $('#sidebar').css('height', ''); // reset height

    var bodyHeight = $('body').height() - 40, // bug fix for gap below footer (but not on DDOL - check the info on the top of this file).
        headerHeight = $('.trs-header').outerHeight(),
        breadcrumbHeight = $('#breadcrumbs-section').outerHeight(),
        offset = $('body').hasClass('tablet') ? 40 : 0,
        sidebarHeight = 0;

    if ($(window).width() > bp.tablet) {
        sidebarHeight = bodyHeight - headerHeight - breadcrumbHeight + offset;
    } else {
        sidebarHeight = bodyHeight - headerHeight;
    }

    $('#sidebar').css('height', sidebarHeight);
    $(window).off('resize.fixSidebar').on('resize.fixSidebar', fixSidebar); // set listener
}, 250);

// Init Accordion Tables
function initAccordionTables() {
    var $table = $('.accordion-table'),
        $cell = $table.find('.table-body .cell'),
        $tbody = $cell.closest('.table-body');

    if (!arguments[0]) {
        $cell.addClass('no-collapsing'); // for super fast collapsing
    }

    $cell.addClass('collapse');
    $tbody.hide(0);

    $tbody.each(function(idx, el) {
        var $icon = $(el).prev().find('.glyphicon');

        if ($(el).attr('aria-expanded') === "true") {
            $(el).show(0).find('.cell').addClass('in');
            $icon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
        } else {
            $icon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
        }
    });

    $cell.on('show.bs.collapse', debounce(function() {
        var $c = $(this);
        $c.closest('.table-body').attr('aria-expanded', true).show(0);

        var $icon = $c.closest('.table-body').prev().find('.glyphicon');
        if ($icon.hasClass('glyphicon-plus-sign')) {
            $icon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
        }
    }, 250));

    $cell.on('hidden.bs.collapse', debounce(function() {
        var $c = $(this);
        $c.closest('.table-body').attr('aria-expanded', false).hide(0);

        var $icon = $c.closest('.table-body').prev().find('.glyphicon');
        if ($icon.hasClass('glyphicon-minus-sign')) {
            $icon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
        }
    }, 250));
}

// Init Scrollable Tables (uses DataTables.net)
function initScrollableTables() {
    var $table = $('table.table--scrollable');

    if ($table.length > 0) {
        $table
            .each(function(index, el) {
                if (!$.fn.dataTable.isDataTable($(el))) {
                    var oTable = $(el).DataTable({
                        deferRender: true,
                        autoWidth: true,
                        info: false,
                        ordering: false,
                        scrollY: 340,
                        scrollCollapse: true,
                        scroller: true,
                        paging: false,
                        searching: false
                    });

                    $('.modal').on('shown.bs.modal', function() {
                        oTable.columns.adjust().draw();
                        $(el).parent('.dataTables_scrollBody').css('overflow-x', 'hidden');
                    });
                }
            });
    }
}

// Init equal heights plugin
var initEqHeight = debounce(function() {
    'use strict';

    var $container = $('.js-eq-ht-container'),
        $item = $('.js-eq-ht-div');

    // reset height
    $item.css('height', '');

    // fix sidebar
    if (typeof fixSidebar === 'function') {
        fixSidebar();
    }

    // tablet and desktop only (>= 768)
    if ($(window).width() >= bp.tablet) {
        $container.each(function(idx, el) {
            $(el).find($item).matchHeight({
                remove: true
            }); // remove previous bindings
            $(el).find($item).matchHeight({
                byRow: false,
                property: 'height',
                target: null,
                remove: false
            }); // default settings
        });
    } else {
        $container.find($item).matchHeight({
            remove: true
        }); // remove previous bindings
    }
    // end tablet and desktop only (>= 768)

    // if mobile needs eq height == CUSTOM FOR DCMA PAGES
    // note: most of the time, the "js-eq-ht-container" components,
    // in mobile view, DO NOT need to be modified! The below is for
    // the exceptions!
    var $container_mobile = $('.js-mobile-eq-ht-container'),
        $item_mobile = $container_mobile.find('.js-eq-ht-div');

    if ($(window).width() < bp.tablet && $container_mobile) {
        // reset height
        $item_mobile.css('height', '');

        $container_mobile.each(function(idx, el) {
            $(el).find($item_mobile).matchHeight({
                remove: true
            }); // remove previous bindings
            $(el).find($item_mobile).matchHeight({
                byRow: false,
                property: 'height',
                target: null,
                remove: false
            }); // default settings
        });
    }
    // end if mobile needs eq height == CUSTOM FOR DCMA PAGES

    // Reset events
    $(window).off('resize.initEqHeight').on('resize.initEqHeight', initEqHeight);
}, 250);

// hasClass needs a big brother
$.fn.extend({
    hasClasses: function() {
        'use strict';

        var self = this;
        for (var i = 0, il = arguments.length; i < il; i++) {
            if ($(self).hasClass(arguments[i])) return true;
        }
        return false;
    }
});

// When CSS just won't cut it.
$.fn.setVerticalCenter = function(){
	var $this = $(this),
		$container = $this.closest('.js-vert-container'),
		h = $container.innerHeight(),
		h2 = $(this).innerHeight();

	$this.css('margin-top', (h - h2)/2);
};

// Set body class based on browser width and swap desktop and mobile nav
function initBodySize() {
    'use strict';

    // Skip IE7-breaking code
    if ($('html').hasClass('ie7')) {
        $('body').addClass("desktop");
        return;
    }

    if ($('.layout-non-responsive, [data-ui-compat=non-responsive]').length > 0 || Response.band(bp.desktop)) {
        setBodyClass('desktop');
    } else if (Response.band(bp.tablet, bp.desktop - 1)) {
        setBodyClass('tablet');
    } else {
        // 0-480
        setBodyClass('mobile');
        $('.menuwrapper').mobile_menu({
            animationClasses: {
                classin: 'mobile-animate-in',
                classout: 'mobile-animate-out'
            }
        });
    }
}

function setBodyClass(bodyClass) {
    'use strict';

    var body = $('body');
    if (bodyClass && !body.hasClass(bodyClass)) {
        PrimaryNavHtml.restore();
    }
    body.removeClass('mobile tablet desktop');
    if (bodyClass) {
        body.addClass(bodyClass);
    }
}

function startPopovers() {
    'use strict';

    // anchors the popover position in case links show on two lines
    $('[data-toggle="popover"]').popover({
        container: 'body'
    });
}

function startTooltips() {
    'use strict';

    // anchors the tooltip position in case links show on two lines
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
        trigger: 'hover' // 'click hover focus manual'
    });
}

function mobileAccordionActions() {
    'use strict';

    if (Response.band(bp.tablet)) {
        $('.js-mbl-accordion__pnl').collapse('show');
    } else {
        $('.js-mbl-accordion__pnl').collapse('hide');
    }
}

// Store initial nav HTML for easy resetting on resize
var PrimaryNavHtml = (function() {
    'use strict';

    var wrapper = $('.menuwrapper');
    var originalNav = wrapper.html();
    return {
        restore: function() {
            if (originalNav) {
                wrapper.html(originalNav);
            }
        }
    };
}());

function crumbAcctViewer() {
    'use strict';

    var $crumbContainer = $('#crumb_box'),
        $switchLink = $('#switch_link'),
        $planName = $('#plan_name'),
        $planId = $('#plan_id'),
        $planBalance = $('#plan_bal');

    // used for resizing - should affect tablet only, minimal desktop usage.
    $planName.width('');
    $('.breadcrumb__dropdown').remove();
    $planId.show();

    // take measurements
    var a = $crumbContainer.width() || 0,
        b = $switchLink.outerWidth(true) || 0,
        c = $planName.outerWidth(true) || 0,
        d = $planId.outerWidth(true) || 0,
        e = $planBalance.outerWidth(true) || 0,
        f = b + c + d + e;

    var _template = "<li class='dropdown breadcrumb__dropdown'>";
    _template += "<button href='javascript:void(0);' type='button' data-toggle='dropdown' id='breadcrumbDropdown' class='dropdown-toggle breadcrumb__button'>";
    _template += "<span role='presentation' class='breadcrumb__dropdown__ellipse'></span>";
    _template += "<span role='presentation' class='breadcrumb__dropdown__ellipse'></span>";
    _template += "<span role='presentation' class='breadcrumb__dropdown__ellipse'></span>";
    _template += "<span class='sr-only'>Open summary information</span></button>";
    _template += "<ul class='dropdown-list' aria-labelledby='breadcrumbDropdown'><li>" + $planName.text() + "</li>";
    _template += "<li>" + $planId.text() + "</li>";
    _template += "<li>" + $planBalance.text() + "</li></ul></li>";

    if (f > a) {
        $planId.hide();
        $planName.after(_template);
        var g = $('.breadcrumb__dropdown').outerWidth(),
            h = a - (b + e + g + 35); // 35px margin totals?
        $planName.width(h);
        $('.breadcrumb__dropdown .dropdown-list').width(h * 0.6);
    } else {
        return false;
    }
}

// Check for mobile (works 98% of the time, according to scientists)
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
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// Check for vibration API (haptic feedback)
var supportsVibrate = "vibrate" in navigator;

// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    'use strict';

    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Format date string, from mm/dd/yyyy to yyyy-mm-dd
// Dependency: MomentJS
var formatDateISO = function(dateLocale) {
    'use strict';

    if ( isValidDateUS(dateLocale) ) {
        var d = moment(dateLocale).format('YYYY-MM-DD');
        return d;
    }

    return false;
};
window.formatDateISO = formatDateISO;

// Format date string, from yyyy-mm-dd to mm/dd/yyyy
// Dependency: MomentJS
var formatDateUS = function(dateISO) {
    'use strict';

    if ( isValidDateISO(dateISO) ) {
        var d = moment(dateISO).format('MM/DD/YYYY');
        return d;
    }

    return false;
};
window.formatDateUS = formatDateUS;

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
    if (!/^\d{4}\-\d{2}\-\d{2}$/.test(dateString)) {
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

// Cross-browser checks for "transition end" and "animation end"
function whichTransitionEvent() {
    "use strict";
    var i, e = document.createElement("div"),
        s = {
            transition: "transitionend",
            OTransition: "otransitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
    for (i in s)
        if (s.hasOwnProperty(i) && void 0 !== e.style[i]) return s[i];
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
    for (i in s)
        if (s.hasOwnProperty(i) && void 0 !== e.style[i]) return s[i];
}

var transitionEnd = whichTransitionEvent(),
    animationEnd = whichAnimationEvent();

// Handle Wide Tables - handling tables that get wider than their containers
function handleWideTables(selector) {
    'use strict';

    // reset sizes
    $('.autoresize').removeClass('autoresize text-small text-xsmall text-xxsmall text-xxxsmall');
    var sizes = [null, 'text-small', 'text-xsmall', 'text-xxsmall', 'text-xxxsmall'];

    if (!selector) {
        selector = '.layout-responsive table:not(.js-tbl-nofontresize), [data-ui-compat=responsive] table:not(.js-tbl-nofontresize)';
    }

    var index = 0;
    (function iterate() {
        if (index >= sizes.length - 1) {
            return;
        }

        var tables = sizes[index] ? $(selector).filter('.' + sizes[index]) : $(selector);
        if (tables.length > 0) {
            index += 1;
            tables
                .each(function(idx, el) {
                    var $el = $(el);
                    var elementWidth = $el.actual('width');
                    var parentWidth = $el.parent().actual('width');

                    if (elementWidth > parentWidth && parentWidth > 0) {
                        $el.removeClass(sizes[index - 1]).addClass(sizes[index] + ' autoresize');
                    }
                })
                .promise()
                .done(function(){
                    iterate();
                });
        }
    }());
}

// Opens the source of an iframe in a new window, then print it (if on same domain/protocol)
function printIframeSrc(id) {
    if (typeof arguments[0] === 'undefined') {
        return;
    }

    var src = $('#'+id).attr('src'),
        screenWidth = $(window).width(),
        screenHeight = $(window).height(),
        w = 800,
        h = 600,
        top = (screenHeight - h) / 2,
        left = (screenWidth - w) / 2;

    var uniqueName = new Date();
    var windowName = 'Print' + uniqueName.getTime();

    // url, name, specs, replace
    var oWindow = window.open(src, windowName, 'height='+h+', width='+w+', left='+left+', top='+top+', location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=1');

    if (oWindow.document.readyState === 'complete') {
        oWindow.focus();
        oWindow.print();
    }
}

// Print an element with #ID elementId
function printContent(elementId) {
    var el = document.getElementById(elementId);

    if (el === null) {
        console.log('Not a valid element ID');
        return false;
    }

    var contents = el.innerHTML;
    var w = window.open('', 'printContent', 'top=0, left=0, width=768, height=576');

    // write the HML, print on load
    w.document.open();
    w.document.write('<html><head><title>Print version</title>');
    w.document.write('<link rel="stylesheet" media="print" href="/ddol/tiles/generic/css/print.css?v='+ Math.random() +'"></head>');
    w.document.write('<body onload="print(); close()">');
    w.document.write(contents);
    w.document.write('</body></html>');
    w.document.close();
}

// Global function to close BS Modals from within iframes
// usage (from within iframe): window.parent.closeBootstrapModal();
window.closeBootstrapModal = function(){
    $('.modal[role=dialog]').modal('hide');
};

// Fix the page's title, removing HTML tags from it
function fixPageTitle() {
    document.title = $('<div/>').html(document.title).text();
}

// Add an optgroup to every select in order to avoid truncating the content
if (navigator.userAgent.match(/(iPhone)/i)) {
    var selects = document.querySelectorAll("select");
    for (var i = 0; i < selects.length; i++ ){
        selects[i].appendChild(document.createElement("optgroup"));
    }
}

// Automatically cancel unfinished ajax requests
// when the user navigates elsewhere OR when it gets manually called with window.abortAllAjax()
(function($) {
    var xhrPool = [];
    $(document).ajaxSend(function(e, jqXHR, options) {
        xhrPool.push(jqXHR);
    });
    $(document).ajaxComplete(function(e, jqXHR, options) {
        xhrPool = $.grep(xhrPool, function(x) {
            return x !== jqXHR;
        });
    });
    var abort = function() {
        $.each(xhrPool, function(idx, jqXHR) {
            jqXHR.abort();
        });
    };

    // only cancel requests if there is no prompt to stay on the page
    // if there is a prompt, it will likely give the requests enough time to finish
    var oldbeforeunload = window.onbeforeunload;
    window.onbeforeunload = function() {
        var r = oldbeforeunload ? oldbeforeunload() : undefined;
        if (r === undefined) {
            abort();
        }
        return r;
    };

    // manually called function where needed
    window.abortAllAjax = function() {
        abort();
    };
})(jQuery);

// Simple Responsive Tables - based on work by Matt Smith (http://codepen.io/AllThingsSmitty/pen/MyqmdM)
function initSimpleResponsiveTable() {
    $(".tbl-responsive")
        .each(function() {
            var responsiveTable = $(this),
                responsiveHeadRow = responsiveTable.find("thead tr");

            // grabs THEAD text and add it to cells for use with data-label (smart phone view); will ignore already existing data-label
            responsiveTable.find("tbody tr:not([role=presentation]), tfoot tr:not([role=presentation])").each(function() {
                var curRow = $(this);
                for (var i = 0; i < curRow.find("td").length; i++) {
                    var rowSelector = "td:eq(" + i + "):not([data-label])";
                    var headSelector = "th:eq(" + i + ")";
                    curRow.find(rowSelector).attr('data-label', responsiveHeadRow.find(headSelector).html());
                }
            });
        })
        .promise()
        .done(function() {
            initSRTFixedHeaders();
        });
}

// Fixed headers for Simple Responsive Tables
function initSRTFixedHeaders() {
    // INIT FIXED ROWS
    var $fixedRow = $('.tbl-responsive__fixedRow'),
        $fixedHeader = $('.tbl-responsive__mainHeader'),
        fixedRowWidth,
        fixedHeaderWidth; // TODO: width for main header

    // get the table width
    function getTableWidth() {
        var w = $fixedRow.closest('table').width();
        return w;
    }

    // create the main header holder
    // TODO: create function to stick main header above all fixed rows
    var $fixedHeaderHolder = $fixedHeader.clone();

    // create the row holders
    var $fixedRowHolder = $fixedRow.first().clone();
    $fixedRowHolder.removeClass().addClass('tbl-responsive__rowHolder').attr('role','presentation').find('td').removeAttr('class data-label scope').html('');

    // add the holders to the table
    $fixedRow.before($fixedRowHolder);

    // set row width
    fixedRowWidth = getTableWidth();

    // stack rows
    function stackRows() {
        var $fixedRow = $('.tbl-responsive__fixedRow'); // necessary because of window resize
        $fixedRow.each(function(idx, el) {
            var $row = $(el),
                $nextRow = $row.parent().next('tbody').find('.tbl-responsive__fixedRow').eq(0),
                $rowHolder = $row.prev();

            var rowHeight = $row.outerHeight(),
                nextRowOffset = $nextRow.offset(),
                rowHolderOffset = $rowHolder.offset();

            if (window.pageYOffset > rowHolderOffset.top) {
                if (typeof $nextRow !== 'undefined') {
                    var diff = nextRowOffset.top - window.pageYOffset;
                    if (diff < rowHeight) {
                        $row
                            .addClass('freezeIt')
                            .css({
                                width: fixedRowWidth,
                                top: -(rowHeight - diff)
                            });
                    } else {
                        $rowHolder
                            .css({
                                height: rowHeight
                            });

                        $row
                            .addClass('freezeIt')
                            .css({
                                width: fixedRowWidth,
                                top: 0
                            });
                    }
                } else {
                    $rowHolder
                        .css({
                            height: rowHeight
                        });

                    $row
                        .addClass('freezeIt')
                        .css({
                            width: fixedRowWidth,
                            top: 0
                        });
                }
            } else {
                $rowHolder
                    .css({
                        height: ''
                    });

                $row
                    .removeClass('freezeIt')
                    .css({
                        width: '',
                        top: ''
                    });
            }
        });
    }

    // init listeners
    $(window).on('scroll.fixedRows', stackRows);
    $(window).on('resize.fixedRows orientationchange.fixedRows', function() {
        $fixedRow.removeClass('freezeIt').css({width:'', top:''});
        fixedRowWidth = getTableWidth();
    });
}
