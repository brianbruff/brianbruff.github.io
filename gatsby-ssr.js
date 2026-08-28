/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react")

require("./src/styles/design-system.css")
require("./src/styles/site-chrome.css")
// The plugin stylesheet first, so our theme gets the last word on it.
require("prismjs/plugins/line-numbers/prism-line-numbers.css")
require("./src/styles/prism-theme.css")

/**
 * Motion is decided before first paint, not after. The document ships with the
 * reduced, fully readable layout, so a visitor without JavaScript gets that
 * rather than a page of stalled pinned sections.
 */
const MOTION_SCRIPT = `document.documentElement.dataset.motion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';`

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({
  setHtmlAttributes,
  setHeadComponents,
  setPreBodyComponents,
}) => {
  setHtmlAttributes({ lang: `en-IE`, "data-motion": `reduced` })

  setHeadComponents([
    <link key="gf-pre" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link
      key="gf-static"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="gf"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;800&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&display=swap"
    />,
    <link
      key="favicon"
      rel="icon"
      href={
        "data:image/svg+xml," +
        "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
        "%3Crect width='32' height='32' fill='%230a0705'/%3E" +
        "%3Crect x='11' y='11' width='10' height='10' transform='rotate(45 16 16)' fill='%23e39b4a'/%3E" +
        "%3C/svg%3E"
      }
    />,
  ])

  setPreBodyComponents([
    <script key="motion" dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />,
  ])
}
