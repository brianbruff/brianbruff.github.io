import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <Layout>
    <div className="page">
      <div className="page__inner">
        <p className="eyebrow">404 / No signal</p>
        <h1 className="masthead__title">That page isn’t here.</h1>
        <p className="masthead__intro">
          The link may be old, or the page may have moved. The writing archive
          is the best place to pick the trail back up.
        </p>
        <div className="actions">
          <Link className="btn" to="/blog/">
            Read the writing&nbsp;→
          </Link>
          <Link className="link" to="/">
            Back to the start
          </Link>
        </div>
      </div>
    </div>
  </Layout>
)

export const Head = () => <Seo title="Page not found" />

export default NotFoundPage
