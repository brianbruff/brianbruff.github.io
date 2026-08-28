/**
 * SEO component. Pass `absolute` when the page title already names the site,
 * so the homepage does not end up saying "Brian Keating — Brian Keating".
 */
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const SOCIAL_CARD = "/images/social-card.jpg"

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
