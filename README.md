<p align="center">
  <img alt="Brian Keating" src="static/brian-profile.jpg" width="140" style="border-radius: 50%" />
</p>

<h1 align="center">briankeating.net</h1>

<p align="center">Personal site and technical blog of Brian Keating.</p>

---

This is the source for my professional page and blog at
[briankeating.net](https://briankeating.net). It's a place to keep my CV up to
date and to write up things I've been working on — mostly multi-agent and
multi-modal AI systems, .NET and cloud architecture, and the odd amateur radio
side project.

Posts live as Markdown files in `src/posts/`, named `YYYY-MM-DD-title-slug.md`.

## Running locally

```shell
npm install
npm start
```

The site runs at `http://localhost:8000`. `npm run build` produces the
production output in `public/`.

## Stack

Gatsby 5, React 18, Markdown via `gatsby-transformer-remark`, deployed to
GitHub Pages by GitHub Actions on push to `master`.
