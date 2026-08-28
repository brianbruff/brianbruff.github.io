import * as React from "react"

/**
 * An external link whose URL might not be confirmed yet.
 *
 * With no href it renders as plain text rather than a guessed or dead link —
 * so an unset entry in site-links.js degrades honestly instead of shipping a
 * broken destination.
 */
const OutboundLink = ({ href, className = "", children, ...rest }) => {
  if (!href) {
    return (
      <span className={`${className} link--unresolved`.trim()} aria-disabled="true">
        {children}
      </span>
    )
  }

  const external = /^https?:/i.test(href)

  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  )
}

export default OutboundLink
