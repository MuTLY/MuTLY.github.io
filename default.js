"use strict";

(function externalLinks() {
  if (document.querySelector) {
    const externalLinks = document.querySelectorAll("a[rel=external]");
    [].slice.call(externalLinks).forEach(function (link) {
      link.target = "_blank";
      link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
    });
  }
})();

// Enhanced browser detection
const browser = {
  isFirefox: () => navigator.userAgent.includes('Firefox'),
  isChrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg'),
  isSafari: () => navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'),
  isEdge: () => navigator.userAgent.includes('Edg'),
  isOpera: () => navigator.userAgent.includes('OPR'),
  isIE: () => navigator.userAgent.includes('MSIE') || navigator.userAgent.includes('Trident/')
};

// Consolidated platform and device detection
const device = {
  // Platform detection
  platform: {
    isMac: () => navigator.userAgent.includes('Mac'),
    isWindows: () => navigator.userAgent.includes('Windows'),
    isLinux: () => navigator.userAgent.includes('Linux')
  },
  
  // Mobile device detection
  mobile: {
    isWindows: () => navigator.userAgent.match(/IEMobile/i),
    isAndroid: () => navigator.userAgent.match(/Android/i),
    isBlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
    isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isIPad: () => /iPad/.test(navigator.userAgent) && !window.MSStream,
    isIPhone: () => /iPhone/.test(navigator.userAgent) && !window.MSStream,
    isOpera: () => navigator.userAgent.match(/Opera Mini/i),
    isKindle: () => navigator.userAgent.match(/Silk/i),
    isAny: function() {
      return (
        this.isWindows() ||
        this.isAndroid() ||
        this.isBlackBerry() ||
        this.isIOS() ||
        this.isOpera() ||
        this.isKindle()
      );
    }
  },
  
  // Screen size detection
  screen: {
    isMobile: () => window.matchMedia('(max-width: 768px)').matches,
    isTablet: () => window.matchMedia('(max-width: 1024px)').matches,
    isDesktop: () => window.matchMedia('(min-width: 1025px)').matches
  }
};

let str = "Leandro Rabello Barbosa";
const vWidth = window.innerWidth;
const d = document.querySelector("body");

// Determine console command based on platform and browser
if (!device.mobile.isAny()) {
  if (browser.isFirefox()) {
    str = "Ctrl + Shift + K";
  } else if (device.platform.isMac()) {
    if (browser.isSafari()) {
      str = "Command + Option + I";
    } else {
      str = "Command + Option + J";
    }
  } else {
    str = "Ctrl + Shift + J";
  }
}

// Add tablet class if needed
if ((vWidth <= 1024 && device.mobile.isAny()) || device.mobile.isKindle()) {
  d.classList.add("tablet");
}

document.title = str;

// Format command string with buttons
str = str.replace(/ \+/g, " </button> + <button>");
str = "<button> " + str + " </button>";

document.querySelector(".command").innerHTML = str;

// magic starts here
const weekday = function () {
  const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    now = new Date();
  return dayNames[now.getDay()];
};

/**
 * Display an image in the console.
 * https://github.com/adriancooney/console.image/issues/25
 */
console.image = function (url, backgroundColour, scale) {
  // Convert the URL to a base64 string to preserve animation
  fetch(url)
      .then(response => response.blob())
      .then(blob => {
          const reader = new FileReader();
          reader.onloadend = function() {
              const base64data = reader.result;
              
              // Now load the image to get dimensions
              const img = new Image();
              img.onload = () => {
                  console.log(
                      `%c Hello, my name is`,
                      `
                      font-size: 1px;
                      padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                      background-image: url(${base64data});
                      background-repeat: no-repeat;
                      background-size: ${img.width * scale}px ${img.height * scale}px;
                      color: transparent;
                      `
                  );
              };
              img.src = base64data;
          };
          reader.readAsDataURL(blob);
      })
      .catch(error => {
          console.error("Error loading image:", error);
      });
};

const showInfo = () => {
  let css;

  css = "font-size: 28px; color: #0055FF;";
  console.log("%cLeandro Barbosa", css);

  css = "font-size: 12px;";
  console.log(
    "%cI'm a front end developer.\nI focus on the finished product.\nI want things done fast, with quality.\nI like communication between teams.\nI like to do new things.",
    css
  );

  const c1 = "color: #ff9900;";
  const c2 = "color: #666";

  console.log(" ");

  console.log("%cWhat I do:", c1);

  console.log(
    "%c  ★ Front end developer;\n  ★ UX/UI;\n  ★ HTML5;\n  ★ JavaScript;\n  ★ CSS3.",
    c2
  );

  console.log(" ");

  console.log("You can reach me on...");

  css = "color: #0000FF;";
  console.log("%ctwitter.com/MuTLY", css);
  console.log("%cfb.com/MuTLY", css);
  console.log("%cleandro.barbosa@live.com", css);

  console.log(" ");

  css = "color: #FF0000";
  console.log("Hope you're having a nice " + weekday() + ".");
  console.log("%c❤", css, "Leandro");

  console.log(" ");
};

function showImage(callback) {
  console.image(
    "https://mutly.github.io/images/Leandro-R-Barbosa.jpg",
    "transparent",
    0.25
  );

  setTimeout(() => callback(), 150);
}

(function showAll() {
  showImage(showInfo);
})();
