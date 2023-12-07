"use strict";

(function externalLinks() {
  if (document.querySelector) {
    var i = document.querySelectorAll("a[rel=external]");
    [].slice.call(i).forEach(function (i) {
      i.target = "_blank";
    });
  }
})();

const isMobile = {
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  iPad: function () {
    return navigator.userAgent.match(/iPad/i);
  },
  iPhone: function () {
    return navigator.userAgent.match(/iPhone/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Kindle: function () {
    return navigator.userAgent.match(/Silk/i);
  },
  any: function () {
    return (
      isMobile.Windows() ||
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Kindle()
    );
  },
};

let str = "Leandro Rabello Barbosa";
const vWidth = window.innerWidth;
const d = document.querySelector("body");

if (!isMobile.any()) {
  str = "Ctrl + Shift + J";
}

if (navigator.userAgent.indexOf("Firefox") !== -1) {
  str = "Ctrl + Shift + K";
}

if (navigator.userAgent.indexOf("Mac OS X") !== -1 && !isMobile.iOS()) {
  // str = "⌘ + ⌥ + J";
  str = "Command + Option + J";
}

if (
  navigator.userAgent.indexOf("Mac OS X") !== -1 &&
  navigator.userAgent.indexOf("Safari") !== -1 &&
  navigator.userAgent.indexOf("Chrome") === -1 &&
  !isMobile.iOS()
) {
  str = "Command + Option + I";
}

if ((vWidth <= 1024 && isMobile.any()) || isMobile.Kindle()) {
  d.className = d.className + " tablet";
}

document.title = str;

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
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    if (ctx) {
      c.width = img.width;
      c.height = img.height;
      ctx.fillStyle = backgroundColour;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      const dataUri = c.toDataURL("image/png");

      console.log(
        `%c `,
        `
          font-size: 1px;
          padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor(
          (img.width * scale) / 2
        )}px;
          background-image: url(${dataUri});
          background-repeat: no-repeat;
          background-size: ${img.width * scale}px ${img.height * scale}px;
          color: transparent;
        `
      );
    }
  };
  img.src = url;
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

  console.log("");

  console.log("%cWHat I do:", c1);

  console.log(
    "%c  ★ Front end developer;\n  ★ UX/UI;\n  ★ HTML5;\n  ★ JavaScript;\n  ★ CSS3.",
    c2
  );

  console.log("");

  console.log("You can reach me on...");

  css = "color: #0000FF;";
  console.log("%ctwitter.com/MuTLY", css);
  console.log("%cfb.com/MuTLY", css);
  console.log("%cleandro.barbosa@live.com", css);

  console.log("");

  css = "color: #FF0000";
  console.log("Hope you're having a nice " + weekday() + ".");
  console.log("%c\u2764", css, "Leandro");

  console.log("");
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
