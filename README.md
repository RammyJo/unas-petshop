# Una's Petshop — Website

A lightweight, static website for **Una's Petshop** (Ortega St., Brgy. Ilocanos Sur,
San Fernando, La Union). No frameworks, no backend — just HTML, CSS, JS and SVG.
It can be hosted on Cloudflare Pages, Netlify, GitHub Pages, or any static host.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8080
```

## Deploy

Drag the project folder into Cloudflare Pages / Netlify, or push to a Git
repo and connect it. No build step needed — the output is the folder itself.

## How to update content

Everything editable lives in **`js/data.js`**:

### Add a pet or product

Copy an entry in the `PETS` array and change the fields:

```js
{
  id: "golden-hamster",          // unique, lowercase, hyphenated
  name: "Golden Hamster",
  category: "birds",             // must match a CATEGORIES id ("fish", "birds", "supplies", …)
  species: "Hamster",
  breed: "Syrian",
  attributes: ["Friendly", "Solitary"],
  price: null,                   // number (e.g. 500) ONLY if the shop confirmed it; otherwise null
  status: "inquire",             // "inquire" = "Contact us to check availability"
                                 // "available" = shown as in stock — set only when true
  image: "assets/pets/ranchu.svg",
  alt: "Short description for screen readers",
  note: "Featured in our Facebook page this month.",
}
```

### Mark something sold / in stock

Change `status` to `"available"` (in stock) or remove the entry (sold out).

### Update prices, phone, hours, address

Edit the `BUSINESS` object and the `price` fields in the same file.

### Photos

When real pet photos are available, drop them into `assets/pets/` and point
`image:` at them (jpg/png/webp all work). Keep them square-ish for the card
layout. The card and detail views crop automatically.

## Important rules (please keep)

- Never publish a price or "in stock" claim the shop hasn't confirmed.
- Old Facebook posts are history, not current inventory — keep `status: "inquire"`
  unless Una confirms.
- The illustrations in `assets/pets/` are brand artwork, not photos of actual
  stock; the site copy always says "contact us to check availability".

## File map

```
index.html        one-page site: hero, catalog, about, contact
css/style.css     design tokens (logo colors) + all styles
js/data.js        business info + pet listings  ← edit this
js/main.js        catalog filtering, search, detail modal
assets/logo-original.png   official shop logo
assets/pets/*.svg          brand-style illustrations
```
