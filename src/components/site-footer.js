import * as React from "react"
import { Link } from "gatsby"
import { links } from "../site/links"
import OutboundLink from "./outbound-link"

const SiteFooter = () => (
  <footer className="footer">
    <div>
      <p className="footer__name">Brian Keating</p>
      <p className="meta footer__role">AI Systems Architect</p>
    </div>
    <ul className="footer__links">
      <li>
        <OutboundLink className="link" href={links.github}>
          GitHub
        </OutboundLink>
      </li>
      <li>
        <Link className="link" to="/blog/">
          Blog
        </Link>
      </li>
      <li>
        <Link className="link" to="/resume/">
          Résumé
        </Link>
      </li>
      <li>
        <OutboundLink className="link" href={links.linkedin}>
          LinkedIn
        </OutboundLink>
      </li>
    </ul>
    <p className="meta footer__copy">© {new Date().getFullYear()}</p>
  </footer>
)

export default SiteFooter
