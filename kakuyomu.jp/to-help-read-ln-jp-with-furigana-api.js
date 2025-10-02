// ==UserScript==
// @name         To Help Read LN JP with Furigana API
// @namespace    http://tampermonkey.net/
// @version      2025-10-02
// @description  Add furigana + tooltip arti via batch API
// @author       You
// @match        https://kakuyomu.jp/works/*/episodes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kakuyomu.jp
// @grant        GM_xmlhttpRequest
// @connect      japanese-converter-taupe.vercel.app
// ==/UserScript==

(function () {
  'use strict';

  const jpRegex = /[\u3040-\u30FF\u4E00-\u9FFF]+/g;

  function createTooltip(el, meaning) {
    const tooltip = document.createElement("span");
    tooltip.textContent = meaning;
    tooltip.style.position = "absolute";
    tooltip.style.background = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "4px 6px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "12px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.zIndex = "9999";
    tooltip.style.display = "none";
    tooltip.style.pointerEvents = "none";
    document.body.appendChild(tooltip);

    el.addEventListener("mouseenter", (e) => {
      tooltip.style.display = "block";
      tooltip.style.left = e.pageX + "px";
      tooltip.style.top = (e.pageY + 20) + "px";
    });
    el.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.pageX + "px";
      tooltip.style.top = (e.pageY + 20) + "px";
    });
    el.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  }

  // Fungsi untuk hit API Vercel
  async function getFuriganaBatch(paragraphs) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://japanese-converter-taupe.vercel.app/convert",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ paragraphs }),
        onload: function (res) {
          try {
            const data = JSON.parse(res.responseText);
            resolve(data.results);
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (err) {
          reject(err);
        }
      });
    });
  }

  // Dummy translate API untuk hover
  async function translateText(text) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Arti: " + text);
      }, 100);
    });
  }

  async function processParagraphNode(p) {
    if (p.classList.contains("blank")) return null;

    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
    let node;
    const jpNodes = [];

    while ((node = walker.nextNode())) {
      if (jpRegex.test(node.nodeValue)) {
        jpNodes.push(node);
      }
    }

    return { p, jpNodes };
  }

  async function main() {
    const paras = Array.from(document.querySelectorAll(".widget-episodeBody.js-episode-body p[id]"));

    let batch = [];
    let batchNodes = [];

    for (let i = 0; i < paras.length; i++) {
      const p = paras[i];

      if (!p.classList.contains("blank")) {
        const nodeInfo = await processParagraphNode(p);
        if (nodeInfo) {
          batch.push(p.innerText.trim());
          batchNodes.push(nodeInfo);
        }
      }

      if (p.classList.contains("blank") || i === paras.length - 1) {
        if (batch.length > 0) {
          try {
            const furiganaResults = await getFuriganaBatch(batch);
            furiganaResults.forEach((convertedText, idx) => {
              const { p: paraNode } = batchNodes[idx];
              paraNode.innerHTML = convertedText;

              // tambahkan tooltip arti ke tiap ruby
              const rubies = paraNode.querySelectorAll("ruby");
              rubies.forEach(async ruby => {
                const baseText = ruby.textContent;
                const meaning = await translateText(baseText);
                createTooltip(ruby, meaning);
              });
            });
          } catch (err) {
            console.error("Furigana batch error:", err);
          }
          batch = [];
          batchNodes = [];
        }
      }
    }
  }

  main();
})();
