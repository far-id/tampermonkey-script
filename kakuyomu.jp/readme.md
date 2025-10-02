# Kakuyomu Furigana Helper

A **Tampermonkey script** to help read Japanese light novels on **Kakuyomu** by adding **furigana** and hoverable **translations**.

## Features

- Adds **furigana** (reading) above kanji using a backend API.
- Shows **translation/meaning** on hover (**still under development**).
- Batches paragraphs to reduce API requests.

## Requirements

- Tampermonkey extension (Chrome, Firefox, Edge, etc.)
- A backend **Furigana API** (e.g., your deployed Express app)

## Usage

1. Install Tampermonkey and add this script.
2. Open any Kakuyomu episode page (`https://kakuyomu.jp/works/*/episodes/*`).
3. Kanji will automatically show furigana; hover to see translation.

## Notes

- Made for personal study of Japanese light novels.
- Furigana generation relies on your API (e.g., [Kuroshiro](https://www.npmjs.com/package/kuroshiro)).

## Thanks

- **Kuroshiro** for kanji-to-reading conversion.
- **Tampermonkey** for enabling userscripts in the browser.
