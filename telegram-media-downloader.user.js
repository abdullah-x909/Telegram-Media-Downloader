// ==UserScript==
// @name         Telegram Media Downloader
// @version      3.5.2
// @namespace    https://github.com/abdullah-x909/Telegram-Media-Downloader
// @description  Download images, videos, GIFs, voice messages, stories, and profile photos from Telegram Web (supports restricted channels when stream URLs are available)
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @grant        unsafeWindow
// @author       abdullah-x909
// @updateURL    https://github.com/abdullah-x909/Telegram-Media-Downloader/main/telegram-media-downloader.user.js
// @downloadURL  https://github.com/abdullah-x909/Telegram-Media-Downloader/telegram-media-downloader/main/telegram-media-downloader.user.js

// ==/UserScript==

(function () {
  "use strict";

  /**********************
   * Logger
   **********************/
  function log() {
    console.log("[TG-DL]", ...arguments);
  }
  function error() {
    console.error("[TG-DL]", ...arguments);
  }

  /**********************
   * Utils
   **********************/
  var RANGE_RE = /^bytes (\d+)-(\d+)\/(\d+)$/;

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return h >>> 0;
  }

  function extractFileName(url, fallbackExt) {
    try {
      if (url.indexOf("stream/") !== -1) {
        var meta = JSON.parse(decodeURIComponent(url.split("/").pop()));
        if (meta.fileName) {
          return meta.fileName;
        }
        if (meta.mimeType) {
          return "tg-" + hash(url) + "." + meta.mimeType.split("/")[1];
        }
      }
    } catch (e) {}
    return "tg-" + hash(url) + "." + fallbackExt;
  }

  /**********************
   * Progress UI
   **********************/
  function setupProgressContainer() {
    if (document.getElementById("tgdl-progress-container")) {
      return;
    }
    var c = document.createElement("div");
    c.id = "tgdl-progress-container";
    c.style.position = "fixed";
    c.style.right = "0";
    c.style.bottom = "0";
    c.style.zIndex = "9999";
    document.body.appendChild(c);
  }

  function createProgress(id, name) {
    setupProgressContainer();
    var box = document.createElement("div");
    box.id = id;
    box.style.cssText =
      "background:rgba(0,0,0,.75);color:#fff;padding:8px;margin:6px;width:260px;border-radius:6px;font-size:12px";
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between">' +
      "<span>" + name + "</span>" +
      '<span style="cursor:pointer">✕</span>' +
      "</div>" +
      '<div style="background:#333;height:10px;border-radius:6px;overflow:hidden;margin-top:6px">' +
      '<div style="background:#4ea1ff;height:100%;width:0%"></div>' +
      "</div>" +
      '<div style="text-align:center;margin-top:4px">0%</div>';

    box.querySelector("span:last-child").onclick = function () {
      box.remove();
    };

    document.getElementById("tgdl-progress-container").appendChild(box);
  }

  function updateProgress(id, percent) {
    var box = document.getElementById(id);
    if (!box) {
      return;
    }
    box.querySelector("div div").style.width = percent + "%";
    box.querySelector("div + div").innerText = percent + "%";
  }

  function finishProgress(id) {
    var box = document.getElementById(id);
    if (!box) {
      return;
    }
    box.querySelector("div div").style.background = "#7ccf7c";
    box.querySelector("div + div").innerText = "Done";
  }

  /**********************
   * Range Downloader
   **********************/
  function downloadByRange(url, mimeHint) {
    var next = 0;
    var total = null;
    var chunks = [];

    var id = "tgdl_" + Math.random().toString(36).slice(2);
    var filename = extractFileName(url, mimeHint.indexOf("video") !== -1 ? "mp4" : "bin");

    createProgress(id, filename);

    function fetchNext() {
      fetch(url, {
        headers: { Range: "bytes=" + next + "-" },
        credentials: "include",
        cache: "force-cache"
      })
        .then(function (r) {
          if (r.status !== 200 && r.status !== 206) {
            throw r.status;
          }

          var cr = r.headers.get("Content-Range");
          if (cr) {
            var m = cr.match(RANGE_RE);
            if (!m) {
              throw "Invalid Content-Range";
            }
            if (parseInt(m[1], 10) !== next) {
              throw "Range gap";
            }
            next = parseInt(m[2], 10) + 1;
            total = parseInt(m[3], 10);
            updateProgress(id, Math.floor((next * 100) / total));
          }
          return r.blob();
        })
        .then(function (b) {
          chunks.push(b);
          if (total === null || next < total) {
            fetchNext();
          } else {
            var blob = new Blob(chunks, { type: mimeHint });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            finishProgress(id);
          }
        })
        .catch(function (e) {
          error("Download failed:", e);
        });
    }

    fetchNext();
  }

  function downloadImage(url) {
    var a = document.createElement("a");
    a.href = url;
    a.download = "tg-img-" + hash(url) + ".jpg";
    a.click();
  }

  /**********************
   * Media Detection
   **********************/
  function getActiveMedia() {
    var viewer =
      document.querySelector(".media-viewer-whole.active") ||
      document.querySelector("#MediaViewer .MediaViewerSlide--active");

    if (!viewer) {
      return null;
    }

    var v = viewer.querySelector("video");
    if (v && (v.currentSrc || v.src)) {
      return { type: "video", src: v.currentSrc || v.src };
    }

    var img = viewer.querySelector("img[src]:not(.thumbnail)");
    if (img) {
      return { type: "image", src: img.src };
    }

    return null;
  }

  /**********************
   * Button Injection
   **********************/
  function injectButton() {
    var media = getActiveMedia();
    if (!media) {
      return;
    }

    var topbar =
      document.querySelector(".media-viewer-topbar") ||
      document.querySelector(".MediaViewerActions");

    if (!topbar || topbar.querySelector(".tgdl-btn")) {
      return;
    }

    var btn = document.createElement("button");
    btn.className = "tgdl-btn";
    btn.textContent = "⬇";
    btn.style.fontSize = "20px";
    btn.style.marginLeft = "8px";

    btn.onclick = function () {
      if (media.type === "image") {
        downloadImage(media.src);
      } else {
        downloadByRange(media.src, "video/mp4");
      }
    };

    topbar.appendChild(btn);
  }

  /**********************
   * Bulk Visible Download
   **********************/
  function bulkDownloadVisible() {
    var nodes = document.querySelectorAll("img[src], video[src]");
    var urls = [];
    for (var i = 0; i < nodes.length; i++) {
      var u = nodes[i].currentSrc || nodes[i].src;
      if (u && urls.indexOf(u) === -1) {
        urls.push(u);
      }
    }

    (async function () {
      for (var j = 0; j < urls.length; j++) {
        var url = urls[j];
        if (url.indexOf(".jpg") !== -1 || url.indexOf(".png") !== -1) {
          downloadImage(url);
        } else {
          downloadByRange(url, "video/mp4");
        }
        await new Promise(function (r) {
          setTimeout(r, 1200);
        });
      }
    })();
  }

  /**********************
   * Observers & Expose
   **********************/
  new MutationObserver(injectButton).observe(document.body, {
    childList: true,
    subtree: true
  });

  unsafeWindow.TGDL = {
    bulkDownloadVisible: bulkDownloadVisible
  };

  log("Loaded. Use TGDL.bulkDownloadVisible()");
})();
