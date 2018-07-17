(function() {
    'use strict';

    (function externalLinks() {
        if (document.querySelector) {
            var i = document.querySelectorAll('a[rel=external]');
            [].slice.call(i).forEach(function(i) {
                i.target = '_blank';
            });
        }
    }());

    var isMobile = {
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        iPad: function() {
            return navigator.userAgent.match(/iPad/i);
        },
        iPhone: function() {
            return navigator.userAgent.match(/iPhone/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Kindle: function() {
            return navigator.userAgent.match(/Silk/i);
        },
        any: function() {
            return isMobile.Windows() || isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Kindle();
        }
    };

    var vWidth = window.innerWidth,
        str = 'Leandro Rabello Barbosa',
        d = document.querySelector('body');

    if (!isMobile.any()) {
        str = 'Ctrl + Shift + J';
    }

    if (navigator.userAgent.indexOf('Mac OS X') !== -1 && !isMobile.iOS()) {
        //str = "⌘ + ⌥ + J";
        str = 'Command + Option + J';
    }
    
    if (navigator.userAgent.indexOf('Mac OS X') !== -1 && navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 && !isMobile.iOS()) {
        str = 'Command + Option + I';
    }


    if ((vWidth <= 1024 && isMobile.any()) || isMobile.Kindle()) {
        d.className = d.className + ' tablet';
    }

    document.title = str;

    str = str.replace(/ \+/g, ' </button> + <button>');
    str = '<button> ' + str + ' </button>';

    document.querySelector('.command').innerHTML = str;

    // magic starts here
    var weekday = function() {
        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            now = new Date();
        return dayNames[now.getDay()];
    };

    var css = 'background-image: linear-gradient(to top,transparent,transparent), url(\'https://mutly.github.io/images/Leandro-MuTLY-Barbosa.jpg\'); background-repeat: no-repeat; background-size: 205px 205px; border:1px #ccc solid; margin: 0 0 0 300px; padding: 0 205px 205px 0; font-size: 0px;';
    console.log('%c', css);

    css = 'font-size: 28px; color: #0066FF; background: -webkit-linear-gradient(#0066ff, #ddd); -webkit-background-clip: text; -webkit-text-fill-color: transparent;';
    console.log('%cLeandro R. Barbosa', css);

    css = 'font-size: 12px;';
    console.log('%cI\'m a front end developer.\nI focus on the finished product.\nI want things done fast, with quality.\nI like communication between teams.\nI like to do new things.', css);

    var c1 = 'color: #ff9900;',
        c2 = 'color: #666';

    console.log('');

    console.log('%cWhat I do:   %c★ Front end developer;\n             ★ UX/UI;\n             ★ HTML5;\n             ★ JavaScript/jQuery;\n             ★ CSS3.', c1, c2);

    console.log('');

    console.log('You can reach me at...');

    css = 'color: #0000FF;';
    console.log('%ctwitter.com/MuTLY', css);
    console.log('%cfb.com/MuTLY', css);
    console.log('%cleandro.barbosa@live.com', css);

    console.log('');

    css = 'color: #FF0000';
    console.log('Hope you\'re having a nice '+ weekday() +'.');
    console.log('%c\u2764', css, 'Leandro');

    console.log('');
}());
