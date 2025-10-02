// ==UserScript==
// @name         MAL API Score Fetcher schedule Page
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  try to take over the world!
// @author       You
// @match        https://www.livechart.me/schedule*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechart.me
// @grant        GM_xmlhttpRequest
// @connect      api.myanimelist.net
// ==/UserScript==

(function () {
  'use strict';

  const elements = document.querySelectorAll('a.lc-tt-anime-title');

  // Helper untuk GM_xmlhttpRequest biar bisa pakai async/await
  function gmFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || "GET",
        url: url,
        headers: options.headers || {},
        data: options.body || null,
        onload: res => {
          try {
            resolve({
              ok: true,
              status: res.status,
              json: () => Promise.resolve(JSON.parse(res.responseText))
            });
          } catch (e) {
            reject(e);
          }
        },
        onerror: err => reject(err)
      });
    });
  }

  async function getAnimeScoreFromMAL(title) {
    title = encodeURIComponent(title);
    try {
      // cari anime berdasarkan judul
      const anime = await gmFetch(`https://api.myanimelist.net/v2/anime?q=${title}&limit=1`, {
        headers: {
          "X-MAL-CLIENT-ID": "CLIENT-ID"
        }
      });
      const data = await anime.json();
      if (!data.data || data.data.length === 0) {
        console.log("Anime tidak ditemukan:", title);
        return null;
      }

      const id = data.data[0].node.id;

      // ambil score by anime ID
      const scoreResp = await gmFetch(`https://api.myanimelist.net/v2/anime/${id}?fields=mean`, {
        headers: {
          "X-MAL-CLIENT-ID": "CLIENT-ID"
        }
      });
      const scoreData = await scoreResp.json();
      return scoreData.mean;
    }
    catch (err) {
      console.error("Error:", err);
      return null;
    }
  }

  function createRatingBadge(rating) {
    const div = document.createElement("div");
    div.className = "lc-tt-action-button-wrap text-xs";
    div.style.marginTop = "-0.3rem";

    const span = document.createElement("span");
    span.textContent = rating;
    span.style.cssText = `
  border-radius: 0.5rem;
  background-color: rgba(29, 78, 216, 0.9);
  padding: 0.125rem 0.5rem;
  color: white;
  font-family: sans-serif;
`;

    div.appendChild(span);
    return div;
  }

  // main
  elements.forEach(async (el) => {
    const title = el.textContent.trim();
    const score = await getAnimeScoreFromMAL(title);

    if (score == null) {
      return;
    }
    let badge = createRatingBadge(score);
    console.log(badge);
    el.insertAdjacentElement("afterend", badge);
  });
})();
