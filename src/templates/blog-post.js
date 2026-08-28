import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/blog-post.css"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  const { title, date, tags } = post.frontmatter

  return (
    <Layout>
      <div className="page">
        <article className="post">
          <header className="post__header">
            <p className="eyebrow">Writing</p>
            <h1 className="post__title">{title}</h1>
            <div className="post__meta">
              <time className="meta">{date}</time>
              {post.timeToRead && (
                <span className="meta">{post.timeToRead} min read</span>
              )}
            </div>
            {tags?.length > 0 && (
              <ul className="post__tags">
                {tags.map(tag => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </header>

          <div
            className="post__body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <footer className="post__footer">
            <Link className="link" to="/blog/">
              ← All writing
            </Link>
          </footer>
        </article>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt(pruneLength: 200)
      frontmatter {
        title
        date(formatString: "DD MMMM YYYY")
        tags
      }
    }
  }
`

export const Head = ({ data }) => (
  <Seo
    title={data.markdownRemark.frontmatter.title}
    description={data.markdownRemark.excerpt}
  />
)

export default BlogPostTemplate
