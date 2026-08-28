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

/**
 * Header navigation.
 *
 * These three come first, in this order, on every page. The header used to
 * carry a different set on the homepage than everywhere else — no Home and no
 * Résumé while you were on the story, no chapters once you left it — so the
 * menu rearranged itself underneath you as you moved around the site. The
 * core is now fixed: wherever you are, the same three links are in the same
 * places.
 *
 * `partiallyActive` marks Writing as current on a post as well as on the
 * index. Home is deliberately without it, or every page would claim to be
 * home.
 */
export const siteNav = [
  { label: "Home", to: "/" },
  { label: "Writing", to: "/blog/", partiallyActive: true },
  { label: "Résumé", to: "/resume/", partiallyActive: true },
]

/**
 * The homepage appends its chapters to that core rather than replacing it.
 * They are in-page anchors and only mean anything while you are on the story,
 * which is why they do not travel to the other pages.
 *
 * Every chapter below the hero is here. The commodity chapter used to be left
 * out, which made it the one piece of work you could only reach by scrolling
 * past everything else or by finding its tick on the rail. The hero has no
 * entry because Home already goes there.
 *
 * Labels are the menu's own, not the chapter ids: the anchors follow the
 * section names in the markup while the words follow what the link is for.
 */
export const storyNav = [
  ...siteNav,
  { label: "Journey", to: "/#journey", chapter: true },
  { label: "Work", to: "/#work", chapter: true },
  { label: "Open source", to: "/#open-source", chapter: true },
  { label: "Analyst", to: "/#commodity", chapter: true },
]
