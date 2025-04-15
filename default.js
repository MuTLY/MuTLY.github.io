"use strict";

function externalLinks() {
  if (document.querySelector) {
    const externalLinks = document.querySelectorAll("a[rel=external]");
    [].slice.call(externalLinks).forEach(function (link) {
      link.target = "_blank";
      link.setAttribute("rel", "noopener noreferrer"); // Security best practice
    });
  }
}
externalLinks();

// Enhanced browser detection
const USER_AGENT = navigator.userAgent;

const PLATFORMS = {
  MAC: "Mac",
  WINDOWS: "Windows",
  LINUX: "Linux",
};

const BROWSERS = {
  FIREFOX: "Firefox",
  CHROME: "Chrome",
  EDGE: "Edg",
  SAFARI: "Safari",
  OPERA: "OPR",
  IE: "MSIE",
  TRIDENT: "Trident",
};

const MOBILE_DEVICES = {
  WINDOWS: /IEMobile/i,
  ANDROID: /Android/i,
  BLACKBERRY: /BlackBerry/i,
  IOS: /iPad|iPhone|iPod/,
  OPERA: /Opera Mini/i,
  KINDLE: /Silk/i,
};

const userAgent = {
  isPlatform: (platform) => USER_AGENT.includes(platform),
  isBrowser: (browser) => USER_AGENT.includes(browser),
  isMobile: (device) => device.test(USER_AGENT),
};

const platform = {
  isMac: () => userAgent.isPlatform(PLATFORMS.MAC),
  isWindows: () => userAgent.isPlatform(PLATFORMS.WINDOWS),
  isLinux: () => userAgent.isPlatform(PLATFORMS.LINUX),
};

const browser = {
  isFirefox: () => userAgent.isBrowser(BROWSERS.FIREFOX),
  isChrome: () =>
    userAgent.isBrowser(BROWSERS.CHROME) && !userAgent.isBrowser(BROWSERS.EDGE),
  isSafari: () =>
    userAgent.isBrowser(BROWSERS.SAFARI) &&
    !userAgent.isBrowser(BROWSERS.CHROME),
  isEdge: () => userAgent.isBrowser(BROWSERS.EDGE),
  isOpera: () => userAgent.isBrowser(BROWSERS.OPERA),
  isIE: () =>
    userAgent.isBrowser(BROWSERS.IE) || userAgent.isBrowser(BROWSERS.TRIDENT),
};

const device = {
  platform,
  mobile: {
    isWindows: () => userAgent.isMobile(MOBILE_DEVICES.WINDOWS),
    isAndroid: () => userAgent.isMobile(MOBILE_DEVICES.ANDROID),
    isBlackBerry: () => userAgent.isMobile(MOBILE_DEVICES.BLACKBERRY),
    isIOS: () => userAgent.isMobile(MOBILE_DEVICES.IOS) && !window.MSStream && navigator.maxTouchPoints && navigator.maxTouchPoints > 2,
    isOpera: () => userAgent.isMobile(MOBILE_DEVICES.OPERA),
    isKindle: () => userAgent.isMobile(MOBILE_DEVICES.KINDLE),
    isAny: function () {
      return Object.values(MOBILE_DEVICES).some((check) =>
        userAgent.isMobile(check)
      );
    },
  },
  screen: {
    isMobile: () => window.matchMedia("(max-width: 768px)").matches,
    isTablet: () => window.matchMedia("(max-width: 1024px)").matches,
    isDesktop: () => window.matchMedia("(min-width: 1025px)").matches,
  },
};

const CONSOLE_COMMANDS = {
  CHROME: "Ctrl + Shift + J",
  FIREFOX: "Ctrl + Shift + K",
  MAC: {
    SAFARI: "Command + Option + I",
    OTHER: "Command + Option + J",
  },
};

function getConsoleCommand() {
  if (device.platform.isMac()) {
    if (!device.mobile.isIOS()) {
      return browser.isSafari()
        ? CONSOLE_COMMANDS.MAC.SAFARI
        : CONSOLE_COMMANDS.MAC.OTHER;
    }
  } else if (browser.isFirefox()) {
    return CONSOLE_COMMANDS.FIREFOX;
  } else if (browser.isChrome()) {
    return CONSOLE_COMMANDS.CHROME;
  } else {
    return undefined
  }
}

let str = getConsoleCommand();

// Format command string with buttons
if (str) {
  str = str.replace(/ \+/g, " </button> + <button>");
  str = "<button> " + str + " </button>";

  document.querySelector(".command").innerHTML = str;
}

document.title = str
  ? "Leandro Rabello Barbosa - Press " + str
  : "Leandro Rabello Barbosa";

const b = document.querySelector("body");

// Add tablet class if needed
if (device.screen.isTablet() || device.mobile.isKindle()) {
  b.classList.add("tablet");
}

// Get weekday name
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
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (reader.readyState === FileReader.DONE) {
          const base64data = reader.result;
          const img = new Image();
          img.onload = () => {
            console.log(
              `%c Hello, my name is`,
              `
                font-size: 1px;
                padding: ${Math.floor((img.height * scale) / 2)}px
                         ${Math.floor((img.width * scale) / 2)}px;
                background-image: url(${base64data});
                background-repeat: no-repeat;
                background-size: ${img.width * scale}px 
                                 ${img.height * scale}px;
                color: transparent;
              `
            );
          };
          img.onerror = () => {
            console.error("Error loading image data");
          };
          img.src = base64data;
        } else {
          console.error("Error loading image data");
        }
      };

      reader.onerror = () => {
        console.error("Error reading blob data.");
      };

      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.error("Error loading or processing image:", error);
    });
};

const cssRules = {
  title: "font-size: 28px; color: #0055FF;",
  body: "font-size: 12px;",
  highlight: "color: #ff9900;",
  muted: "color: #666;",
  link: "color: #0000FF;",
  heart: "color: #FF0000;",
};

const showInfo = () => {
  console.log("%cLeandro Barbosa", cssRules.title);
  console.log(`%c  I'm a front end developer.
  I focus on the finished product.
  I want things done fast, with quality.
  I like communication between teams.
  I like to do new things.`,
    cssRules.body
  );
  console.log(`%cWhat I do:`, cssRules.highlight);
  console.log(`%c  ★ Front end developer;
  ★ UX/UI;
  ★ HTML5;
  ★ JavaScript;
  ★ CSS3.`,
    cssRules.muted
  );
  console.log("You can reach me on...");
  console.log(`%c  github.com/MuTLY
  twitter.com/MuTLY
  fb.com/MuTLY
  leandro.barbosa@live.com`,
    cssRules.link
  );
  console.log(`Hope you're having a nice ${weekday()}.`);
  console.log("%c❤", cssRules.heart, "Leandro");
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
