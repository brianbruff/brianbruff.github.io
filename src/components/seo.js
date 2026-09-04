/**
 * SEO component. Pass `absolute` when the page title already names the site,
 * so the homepage does not end up saying "Brian Keating — Brian Keating".
 */
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const SOCIAL_CARD = "/images/social-card.jpg"

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
}

/**
 * Plain summary text from an HTML excerpt.
 *
 * Ask remark for a PLAIN excerpt and it folds an image's alt text into the
 * prose, so any post opening with a hero image describes itself to Teams,
 * Slack and Google with the alt text. It also drops inline code entirely.
 * Both problems go away if you take the HTML form and strip the tags: alt is
 * an attribute, so it disappears, and code spans keep their text.
 *
 * Query the excerpt longer than you need — the markup counts towards
 * pruneLength — and let this trim it back to a whole word.
 */
export function summarise(html, limit = 200) {
  if (!html) return ""

  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, m => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    // A tag becomes a space, so a code span or link that ends a clause leaves
    // one stranded before the punctuation: "Workflow , Graph and Swarm ."
    .replace(/\s+([,.;:!?%)\]}…])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .trim()

  if (text.length <= limit) return text
  const cut = text.lastIndexOf(" ", limit)
  return `${text.slice(0, cut > 0 ? cut : limit).trimEnd()}…`
}

function Seo({ description, title, absolute = false, image, children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const meta = site.siteMetadata
  const metaDescription = description || meta.description
  const fullTitle = absolute || !meta.title ? title : `${title} — ${meta.title}`
  const card = new URL(image || SOCIAL_CARD, meta.siteUrl).href

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={card} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={meta.author || ``} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={card} />
      {children}
    </>
  )
}

export default Seo
