import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import OutboundLink from "../components/outbound-link"
import Hero from "../components/home/hero"
import Journey from "../components/home/journey"
import Work from "../components/home/work"
import OpenSource from "../components/home/open-source"
import Commodity from "../components/home/commodity"
import { links } from "../site/links"
import { mountScrollStory } from "../site/scroll-story"

import "../styles/home.css"

const IndexPage = () => {
  React.useEffect(() => mountScrollStory(), [])

  return (
    <Layout variant="story" rail>
      <Hero />
      <Journey />
      <Work />
      <OpenSource />
      <Commodity />

      <section className="contact" id="contact" aria-labelledby="contact-heading">
        <p className="eyebrow">Contact</p>
        <h2 className="contact__heading" id="contact-heading">
          Have a difficult system to make useful?
          <em>Let’s start with the signal.</em>
        </h2>
        <div className="actions">
          <OutboundLink className="btn" href={links.email}>
            Start a conversation&nbsp;↗
          </OutboundLink>
          <Link className="link" to="/blog/">
            Read the writing&nbsp;→
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Brian Keating — AI Systems Architect"
    absolute
    description="Designing multi-agent, multi-model systems for complex, high-consequence work. Independent consultant, Ireland."
  />
)

export default IndexPage
