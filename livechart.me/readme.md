# MyAnimeList Score Viewer for LiveChart.me

A **Tampermonkey script** to view MyAnimeList (MAL) scores directly on **LiveChart.me**.

## Requirements

- Tampermonkey browser extension
- A valid **X-MAL-CLIENT-ID** from MyAnimeList
  You can create and manage your client ID via the [MAL API config page](https://myanimelist.net/apiconfig) and refer to the [API v2 documentation](https://myanimelist.net/apiconfig/references/api/v2) for details.

> ⚠️ The script won't work without a proper client ID.

## Installation

1. Install Tampermonkey in your browser.
2. Add a new userscript and paste the code from this repository.
3. Replace the placeholder with your `X-MAL-CLIENT-ID`.
4. Save and enable the script.

## Usage

Open LiveChart.me and the MAL scores will appear next to anime titles automatically.

## Notes

- For personal use only.
- Respect MyAnimeList API rate limits.
