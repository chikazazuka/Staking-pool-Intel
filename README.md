# Staking Pool Intel

A client-side web app for analyzing wallet behavior across staking pools. Upload the wallet list for each pool (for example 7-day, 14-day and 6-month pools) and see which wallets restaked, which left, and which are staking in several pools at once.

Everything runs in your browser. Files are parsed locally and nothing is uploaded to a server.

## Features

Load up to 5 pools, then use the workspace modes:

| Mode | What it does |
| --- | --- |
| **Wallet Finder** | Look up one address and see which pools contain it, with its staked value and unit. |
| **Batch Analysis** | Paste a list of addresses, see which pools each belongs to, and export the results as CSV. |
| **Overlap Detection** | List wallets present in 2 or more pools, with a minimum-overlap filter and address search. |
| **Pool Comparison** | Pick a base pool (A) and a target pool (B) to count **retained** (restaked), **lost** and **new** wallets. |
| **Analytics** | Charts and summary metrics for wallet counts across pools. |
| **Data Validation** | Per-file row, valid-wallet and duplicate counts, plus a deduplicated CSV export. |

### Typical workflow

- **Restaking:** compare an earlier pool (A) with a later pool (B). Wallets in both restaked.
- **Multi-pool staking:** use Overlap Detection to find wallets staking in several pools.

The app has no notion of time. Whether a wallet restaked or staked concurrently depends on which files you upload.

## Supported files

- `.csv`, `.xls`, `.xlsx`
- `.pdf`, `.docx` (wallets are extracted by regex, with no values)

Only EVM addresses (`0x` followed by 40 hex characters) are recognized. For spreadsheets, the app looks for a column whose header contains `wallet` or `address`, and guesses the value column from headers such as `staked`, `balance`, `amount` or `usd`. The value column's header is shown as the unit label. Other files fall back to scanning the whole text for addresses.

The pool name is the filename before the first dot, so name files clearly (for example `7-days.xlsx`).

Sample files in the repo: `sample_staked_data_*.csv` and `sample_unit_data_*.csv`.

## Known limitations

- If a wallet has several rows in one file, only the first value is kept. Later rows are counted as duplicates and not summed.
- Values are kept as text, not numbers, so amounts in different units are not summed or compared.
- Multi-sheet Excel files are merged into a single pool.
- Files over 5 MB are still parsed on the main thread. `src/workers/parser.worker.js` is not wired in yet.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Recharts, Framer Motion. File parsing uses PapaParse, SheetJS (`xlsx`), `pdfjs-dist` and `mammoth`.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts: `npm run build` (type-check and production build), `npm run lint`, `npm run preview`.

## Project layout

```
src/
  components/
    landing/     landing page
    layout/      workspace shell and sidebar
    workspace/   one component per mode
  context/       DocumentContext: loaded pools, overlap map
  hooks/         usePoolIntel (upload flow), useDocumentSearch
  utils/         parsers.ts (file parsing and wallet extraction)
  workers/       parser.worker.js
```

## Roadmap

A planned v2 would add behavior prediction (restaking, next pool, stake size, pool-level forecasts) to help tune minimum stake and APY/APR. It would stay client-side, running Python through Pyodide in a Web Worker.
