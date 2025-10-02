// ==UserScript==
// @name         MAL API Score Fetcher on Anime Page
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  try to take over the world!
// @author       You
// @match        https://www.livechart.me/anime/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      api.myanimelist.net
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
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

  function createRatingElement(rating) {
    // buat div container
    const container = document.createElement("div");
    container.className = "text-sm";

    const spanTitle = document.createElement("span");
    spanTitle.className = "font-medium";
    spanTitle.textContent = "MAL Rating";

    const div = document.createElement("div");

    const spanRating = document.createElement("span");
    spanRating.textContent = rating;
    spanRating.className = "text-lg font-medium";

    const spanTotal = document.createElement("span");
    spanTotal.textContent = "/10";
    spanTotal.className = "text-sm text-base-content/75";

    div.appendChild(spanRating);
    div.appendChild(spanTotal);
    container.appendChild(spanTitle);
    container.appendChild(div);

    return container;
  }

  const title = document.querySelector('span.text-base-content').textContent.trim();
  getAnimeScoreFromMAL(title).then(score => {
    const el = document.querySelector("div.cursor-pointer.flex.gap-2.items-center");
    const elRating = createRatingElement(score);
    el.insertAdjacentElement("afterend", elRating);
  });

})();
