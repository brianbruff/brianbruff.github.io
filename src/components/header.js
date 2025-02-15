import * as React from "react"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header
    style={{
      margin: `0 auto`,
      padding: `var(--space-4) var(--size-gutter)`,
      display: `flex`,
      alignItems: `center`,
      justifyContent: `space-between`,
      borderBottom: '1px solid #ddd',
      background: '#fff',
    }}
  >
    <Link
      to="/"
      style={{
        fontSize: `var(--font-lg)`,
        textDecoration: `none`,
        fontWeight: 'bold',
      }}
    >
      {siteTitle}
    </Link>
    <nav>
      <Link
        to="/blog"
        style={{
          fontSize: `var(--font-sm)`,
          textDecoration: `none`,
          marginLeft: `var(--space-4)`,
        }}
      >
        Blog
      </Link>
      <a
        href="https://github.com/brianbruff"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: `var(--font-sm)`,
          textDecoration: `none`,
          marginLeft: `var(--space-4)`,
        }}
      >
        GitHub
      </a>
    </nav>
  </header>
)

export default Header
