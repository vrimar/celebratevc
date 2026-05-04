# Victoria & Christopher - Wedding Website

A statically-exported Next.js wedding site, designed for deployment to GitHub Pages.

## Design

- **Theme:** Dark espresso brown background (`#2a1810`) with cream text (`#f5e6d3`) and antique gold accents (`#c9a961`)
- **Typography:** Invitation-inspired stack using Cormorant MC/Cormorant SC for headings, Gotham for body text, and Beautifully Declicious Script/BDScript for script accents, with Google Font fallbacks where exact font files are not available locally.
- **Pages:** Home (hero + event details) and RSVP (interactive form)

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build (Static Export)

```bash
npm run build
```

The static site is generated in the `out/` directory.

## Deploying to GitHub Pages

### Option A — Automatic deployment (recommended)

A GitHub Actions workflow is included at `.github/workflows/deploy.yml` and will build and publish the site on every push to `main`.

1. Push the project to a GitHub repository.
2. In the repo: **Settings → Pages → Build and deployment → Source → "GitHub Actions"**.
3. Push to `main`. The workflow runs automatically and your site goes live at `https://<username>.github.io/<repo-name>/`.

The workflow auto-detects the base path, so the site works whether your repo is at `username.github.io` (root) or `username.github.io/repo-name`.

### Option B — Manual deployment

```bash
# If deploying to a project page (username.github.io/repo-name)
NEXT_PUBLIC_BASE_PATH=/repo-name npm run build
touch out/.nojekyll

# Then push the contents of `out/` to a `gh-pages` branch
```

## Customization

- **Names, date, venue:** edit `pages/index.js`, `pages/rsvp.js`, `pages/_app.js`, and `components/Layout.js` (footer).
- **Colors:** edit the CSS variables at the top of `styles/globals.css`.
- **RSVP form submission:** the form currently logs to the console. For a real submission, swap the `handleSubmit` function in `pages/rsvp.js` for a service like [Formspree](https://formspree.io/), [Netlify Forms](https://www.netlify.com/products/forms/), or a Google Form integration — all work with static GitHub Pages hosting.

## Project Structure

```
.
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
├── components/Layout.js           # Nav + footer wrapper
├── pages/
│   ├── _app.js                    # Global styles, fonts, head
│   ├── index.js                   # Home page
│   └── rsvp.js                    # RSVP page
├── styles/globals.css             # All styles
├── next.config.js                 # Static export config
└── package.json
```
