/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Brian Keating's Tech Blog`,
    description: `Technical insights and experiences from a Software Architect, Developer, and Engineer. Exploring software architecture, development practices, and engineering solutions.`,
    author: `@briankeating`,
    siteUrl: `https://briankeating.net/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              showLineNumbers: true,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `brian-keating-tech-blog`,
        short_name: `BK Tech Blog`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#333333`,
        display: `minimal-ui`,
        icon: `src/images/site-icon.png`,
      },
    },
  ],
}
