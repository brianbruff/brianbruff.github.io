/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import * as styles from "./layout.module.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          author
        }
      }
    }
  `)

  return (
    <div className={styles.container}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div className={styles.content}>
        <main>{children}</main>
        <footer className={styles.footer}>
          © {new Date().getFullYear()} Brian Keating. All rights reserved.
          <div className={styles.footerLinks}>
            <a href="https://briankeating.net">briankeating.net</a>
            <span className={styles.divider}>·</span>
            <a href="https://github.com/brianbruff">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout
