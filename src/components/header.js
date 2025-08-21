import * as React from "react"
import { Link } from "gatsby"
import * as styles from "./header.module.css"

const Header = ({ siteTitle }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <Link to="/" className={styles.logo}>
        Brian Keating <span className={styles.accent}>Tech Blog</span>
      </Link>
      <nav className={styles.nav}>
        <Link to="/blog" className={styles.navLink}>
          Blog
        </Link>
        <Link to="/resume" className={styles.navLink}>
          Resume
        </Link>
        <a
          href="https://github.com/brianbruff"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          GitHub
        </a>
      </nav>
    </div>
  </header>
)

export default Header
