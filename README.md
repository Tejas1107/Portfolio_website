# Tejas P Venkatesh: Portfolio

A personal portfolio site for Tejas Pantharapalya Venkatesh, AI & Software Engineer in Dublin. It's plain static HTML, CSS and JavaScript with no build step, and it's set up to deploy on Netlify.

Live at: https://tejas-pv.netlify.app/

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content (hero, about, impact, experience, skills, education, contact) |
| `styles.css` | Design tokens, dark and light themes, responsive layout |
| `script.js` | Theme toggle, mobile menu, scroll reveal, metric count-up, hero pipeline animation |
| `404.html` | Custom not-found page (Netlify serves it automatically) |
| `netlify.toml` | Publish directory, security headers and caching |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Site icon and files for search engines |

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to Netlify

- **Git:** push this repo to GitHub, then in Netlify go to *Add new site → Import from Git* and pick the repo. Leave the build command empty. The publish directory is `.` (already set in `netlify.toml`).
- **Drag and drop:** drag this folder onto https://app.netlify.com/drop.
