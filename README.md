# ⚔ Loot Tracker

A lightweight, self-contained web application for tracking party loot, currency, and notable items in a Dungeons & Dragons 5th Edition campaign. No server, no database, no accounts — just open the file and play.

## Features

- **Currency ledger** — track transactions across configurable currency types (pp, gp, ep, sp, cp) with a running balance and per-currency totals
- **Loot tracker** — log items with quantities, assign them to characters or storage locations, and flag notable magic items
- **SRD autocomplete** — when adding items, search the full D&D 5e SRD magic item catalog via [dnd5eapi.co](https://www.dnd5eapi.co/) for name, description, and tag auto-fill
- **Sortable tables** — sort the ledger and loot list by any column
- **Import / export** — save and load your campaign data as a portable `.json` file
- **Auto-save** — all changes are persisted to `localStorage` so refreshing never loses your work
- **Fully configurable** — customize currency types, characters, and locations from the Settings tab

## Getting started

### Option 1 — open locally (simplest)

Browsers block `fetch()` from `file://` URLs, which disables the SRD autocomplete. Serve the file over HTTP instead:

```bash
# Python (built into macOS/Linux, no install needed)
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

If you have Node.js installed:

```bash
npx serve .
```

### Option 2 — GitHub Pages (share with your party)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root folder (`/`)
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`

No build step or CI required — GitHub Pages serves the `index.html` directly.

## Data & privacy

All campaign data lives in your browser's `localStorage` under the key `loot-tracker-v2`. Nothing is sent to any server. The only outbound request is a one-time fetch to `dnd5eapi.co` at startup to load SRD magic items for autocomplete — this is read-only and anonymous.

### Backing up your data

Use the **Export JSON** button in the top bar to download a snapshot of your campaign as a `.json` file. You can commit this file to the repo alongside `index.html` if you want version-controlled campaign history.

To restore, click **Import** and select your `.json` file.

## Project structure

```
dnd-loot-tracker/
├── index.html        # the entire app — HTML, CSS, and JS inline
├── README.md
└── my-campaign.json  # optional: exported save file
```

## Customisation

All configuration lives in the **Settings** tab at runtime. If you want to change the defaults that appear on first load, edit the `DEFAULT` object near the top of the `<script>` block in `index.html`:

```js
const DEFAULT = {
  campaign: "My Campaign",
  currencies: [ ... ],
  transactions: [ ... ],
  items: [ ... ],
  locations: [ ... ],
  characters: [ ... ]
};
```

## SRD & licensing

Magic item data is sourced from the [D&D 5th Edition SRD](https://dnd.wizards.com/resources/systems-reference-document) via the open [dnd5eapi.co](https://www.dnd5eapi.co/) API, used under the [Open Game License (OGL) v1.0a](https://www.wizards.com/default.asp?x=d20/oglfaq/20040123f). This project contains no copyrighted Wizards of the Coast content beyond what is published in the SRD.

## Roadmap ideas

- [ ] Item value tracking (gp worth per item)
- [ ] Session log / notes tab
- [ ] Print-friendly view
