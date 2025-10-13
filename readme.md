# Tampermonkey Scripts

This repository contains **Tampermonkey scripts** for personal use, aimed at helping me personaly like study Japanese light novels and track anime scores from MyAnimeList.

## Folder Structure

- **kakuyomu.jp/**
  Scripts for reading Japanese light novels on **Kakuyomu**.

  - `to-help-read-ln-jp-with-furigana-api.user.js`: Adds **furigana** above kanji and shows hoverable translations.
  - `readme.md`: Details usage for Kakuyomu scripts.

- **livechart.me/**
  Scripts for fetching **MyAnimeList scores** on **LiveChart** pages.
  - `mal-api-score-fetcher-on-anime-page.user.js`: Fetches and displays MAL scores for anime listed on the page.
  - `mal-api-score-fetcher-schedule-page.user.js`: Fetches MAL scores for scheduled anime.
  - `readme.md`: Details usage for LiveChart scripts.

## Usage

1. Install **Tampermonkey** on your browser (Chrome, Firefox, Edge, etc.).
2. Add the relevant userscript(s) from the folders.
3. Open the corresponding website:
   - `kakuyomu.jp` for light novels.
   - `livechart.me` for anime scores.
4. Scripts will automatically enhance the page:
   - **Kakuyomu**: Shows furigana and hoverable translations.
   - **LiveChart**: Displays MyAnimeList scores next to anime titles.

## Notes

- These scripts are meant for **personal study and convenience**.
- Furigana generation relies on external APIs (like **Kuroshiro**).
- MAL score fetching respects MyAnimeList API rate limits.
