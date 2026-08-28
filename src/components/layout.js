import * as React from "react"

import SiteHeader from "./site-header"
import SiteFooter from "./site-footer"
import SignalRail from "./signal-rail"

/**
 * Site chrome. `variant="story"` is the homepage: chapter nav, the signal
 * rail, and no page container — the scroll story is full bleed and brings its
 * own layout. Everything else gets the standard page wrapper.
 */
const Layout = ({ children, variant = "site", rail = false }) => (
  <>
    <a className="skip-link" href="#main">
      Skip to content
    </a>

    <SiteHeader variant={variant} />
    {rail && <SignalRail />}

    <main id="main">{children}</main>

    <SiteFooter />

    <div className="vignette" aria-hidden="true" />
    <div className="grain" aria-hidden="true" />
  </>
)

export default Layout
