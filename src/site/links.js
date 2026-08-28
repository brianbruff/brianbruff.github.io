/**
 * Every outbound URL for the site lives here and nowhere else.
 *
 * Anything set to null renders as plain text instead of a link, so an
 * unconfirmed URL can never ship as a broken or invented one. Fill one in and
 * the markup picks it up on the next build.
 */
export const links = {
  github: "https://github.com/brianbruff",
  blog: "/blog/",
  resume: "/resume/",
  email: "mailto:b@briankeating.net",

  zeus: "https://github.com/zeus-sdr",
  linkedin: "https://www.linkedin.com/in/brianbruff/",
}

/** Chapters of the homepage scroll story, in order. */
export const chapters = [
  { key: "hero", label: "Orbit" },
  { key: "journey", label: "Journey" },
  { key: "work", label: "Orchestration" },
  { key: "open-source", label: "Open source" },
  { key: "commodity", label: "Commodity" },
]

/** Header navigation. The story uses in-page anchors; other pages don't. */
export const storyNav = [
  { label: "Journey", to: "/#journey" },
  { label: "Work", to: "/#work" },
  { label: "Open source", to: "/#open-source" },
  { label: "Writing", to: "/blog/" },
]

export const siteNav = [
  { label: "Home", to: "/" },
  { label: "Writing", to: "/blog/" },
  { label: "Résumé", to: "/resume/" },
]
