// ==UserScript==
// @name         Add MAL Rating on Anime page
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  try to take over the world!
// @author       You
// @match        https://www.livechart.me/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechart.me
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

  function limitString(text, limit = 86) {
    return text.length > limit ? text.slice(0, limit) : text;
  }

  async function getAnimeScoreFromMAL(title) {
    try {
      // cari anime berdasarkan judul
      const anime = await gmFetch(`https://api.myanimelist.net/v2/anime?q=${title}&limit=1`, {
        headers: {
          "X-MAL-CLIENT-ID": "CLIENT-ID"
        }
      });

        const data = await anime.json();

        if (data.error != null) {
          throw { title, "message": data.message, "error": data.error };
        }

        if (!data.data || data.data.length === 0) {
          console.log("Anime tidak ditemukan:", title);
            throw new Error(`Anime Tidak ditemukan:${title}`);
          }

        const id = data.data[0].node.id;

        // ambil score by anime ID
        const scoreResp = await gmFetch(`https://api.myanimelist.net/v2/anime/${id}?fields=mean,num_scoring_users`, {
          headers: {
            "X-MAL-CLIENT-ID": "CLIENT-ID"
          }
        });
        const scoreData = await scoreResp.json();

        return {
          "rating": scoreData.mean,
          "users": scoreData.num_scoring_users
        };
      }
      catch (err) {
      console.error("Title:", err.title);
      console.error("Error:", err.error);
      console.error("Message:", err.message);
      return null;
    }
  }

  function createRatingElement(rating, users) {
    const container = document.createElement("div");
    container.className = "text-sm";

    const spanTitle = document.createElement("span");
    spanTitle.className = "font-medium";
    spanTitle.textContent = "MAL Rating"

    const div = document.createElement("div");
    div.className = "block items-center";

    const div2 = document.createElement("div");
    const spanRating = document.createElement("span");
    spanRating.textContent = rating;
    spanRating.className = "text-lg font-medium";
    const spanTotal = document.createElement("span");
    spanTotal.textContent = "/10";
    spanTotal.className = "text-sm text-base-content/75";

    const div3 = document.createElement("div");
    const spanRatingUsers = document.createElement("span");
    spanRatingUsers.className = "text-sm text-base-content/75";
    spanRatingUsers.textContent = users + " Users";

    div2.appendChild(spanRating);
    div2.appendChild(spanTotal);
    div3.appendChild(spanRatingUsers);
    div.appendChild(div2);
    div.appendChild(div3);
    container.appendChild(spanTitle);
    container.appendChild(div)

    return container;
  }

  const title = document.querySelector('span.text-base-content').textContent.trim();
  getAnimeScoreFromMAL(
    limitString(
      encodeURIComponent(title)
    )
  ).then(score => {
    const el = document.querySelector("div.cursor-pointer.flex.gap-2.items-center");
    const elRating = createRatingElement(score.rating, score.users);
    el.insertAdjacentElement("afterend", elRating);
  }).catch(err => {
    console.error("Gagal mengambil skor anime:", err);
    });

})();
