// ==UserScript==
// @name         Add MAL & LCM Rating on Schedule page
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

  async function getAnimeRatingFromMAL(title) {
    try {
      // cari anime berdasarkan judul
      const anime = await gmFetch(`https://api.myanimelist.net/v2/anime?q=${title}&limit=1`, {
        headers: {
          "X-MAL-CLIENT-ID": "CLIENT-ID"
        }
      });
      const data = await anime.json();
      if (!data.data || data.data.length === 0) {
        console.log("MAL tidak menemukan:", title);
        return null;
      }

      const id = data.data[0].node.id;

      // ambil rating by anime ID
      const ratingRes = await gmFetch(`https://api.myanimelist.net/v2/anime/${id}?fields=mean`, {
        headers: {
          "X-MAL-CLIENT-ID": "CLIENT-ID"
        }
      });
      const ratingData = await ratingRes.json();
      return ratingData.mean;
    }
    catch (err) {
      console.error("Error:", err);
      return null;
    }
  }

  async function getAnimeRatingFromLcm(title) {
    try {
      // cari anime berdasarkan judul
      const anime = await gmFetch(`https://www.livechart.me/api/v1/anime?q=${title}&limit=1`);
      const data = await anime.json();
      if (!data.items || data.items.length === 0) {
        console.log("LCM tidak menemukan:", title);
        return null;
      }

      const rating = data.items[0].avg_rating;
      return rating;
    }
    catch (err) {
      console.error("Error:", err);
      return null;
    }
  }

  function createRatingBadge(rating, source) {
    //source ="mal"/"lcm"
    const div = document.createElement("div");
    div.className = "lc-tt-action-button-wrap";
    div.style.cssText = `
        margin-top: -0.3rem;
        font-size: 0.66rem;
        `;

    const span = document.createElement("span");
    span.textContent = rating;
    span.style.cssText = `
  border-radius: 0.5rem;
  background-color: rgba(29, 78, 216, 0.9);
  padding: 0.125rem 0.3rem;
  color: white;
  font-family: sans-serif;
`;
    if (source == "lcm") {
      span.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
      div.style.marginLeft = "2rem";
    }
    div.appendChild(span);
    return div;
  }

  // main
  elements.forEach(async (el) => {
    const title = encodeURIComponent(el.textContent.trim());
    const malRating = await getAnimeRatingFromMAL(title);
    const lcmRating = await getAnimeRatingFromLcm(title);

    if (malRating !== null) {
      let malBadge = createRatingBadge(malRating, "mal");
      el.insertAdjacentElement("afterend", malBadge);
    }
    if (lcmRating !== null) {
      let lcmBadge = createRatingBadge(lcmRating, "lcm");
      el.insertAdjacentElement("afterend", lcmBadge);
    }
  });
})();
