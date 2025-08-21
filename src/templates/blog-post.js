import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"
import "../styles/blog-post.css"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article className="blog-post-container">
        <div className="blog-post-card glass-card">
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.frontmatter.title}</h1>
            <p className="blog-post-date">{post.frontmatter.date}</p>
          </header>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            className="blog-post-content"
          />
        </div>
        <footer className="blog-post-footer">
          <Link to="/blog" className="btn btn-secondary">
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`

export const Head = ({ data }) => (
  <Seo title={data.markdownRemark.frontmatter.title} />
)

export default BlogPostTemplate