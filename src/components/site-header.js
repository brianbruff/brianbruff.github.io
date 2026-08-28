import * as React from "react"
import { Link } from "gatsby"
import { storyNav, siteNav } from "../site/links"

/**
 * Quiet fixed header. Transparent over the story, warm-black once scrolled.
 * On the homepage the nav points at chapters; everywhere else at pages.
 */
const SiteHeader = ({ variant = "site" }) => {
  const nav = variant === "story" ? storyNav : siteNav
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`header header--${variant}${scrolled ? " is-scrolled" : ""}`}
    >
      <Link className="header__mark" to="/" aria-label="Brian Keating, home">
        BK
      </Link>

      <nav className="header__nav" aria-label="Sections">
        <ul className="header__list">
          {nav.map(item => (
            <li key={item.label}>
              {item.to.startsWith("/#") ? (
                <a className="header__link" href={item.to.slice(1)}>
                  {item.label}
                </a>
              ) : (
                <Link
                  className="header__link"
                  to={item.to}
                  activeClassName="is-current"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <a className="header__cta" href="#contact">
        Start a conversation&nbsp;↗
      </a>
    </header>
  )
}

export default SiteHeader
