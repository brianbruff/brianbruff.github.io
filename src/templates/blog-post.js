import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo, { summarise } from "../components/seo"
import { slugifyCategory } from "../utils/taxonomy"
import "../styles/blog-post.css"

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark
  const { title, date, category, tags } = post.frontmatter

  return (
    <Layout>
      <div className="page">
        <article className="post">
          <header className="post__header">
            {/* The eyebrow used to read "Writing", which told the reader
                nothing they could not already see. The category says what
                this post is about and doubles as the way back to its
                shelf on the index. Older posts predating the taxonomy
                keep the generic label rather than an empty rule. */}
            <p className="eyebrow">
              {category ? (
                <Link
                  className="post__category"
                  to={`/blog/?category=${slugifyCategory(category)}`}
                >
                  {category}
                </Link>
              ) : (
                "Writing"
              )}
            </p>
            <h1 className="post__title">{title}</h1>
            <div className="post__meta">
              <time className="meta">{date}</time>
              {post.timeToRead && (
                <span className="meta">{post.timeToRead} min read</span>
              )}
            </div>
            {/* Tags were decoration until the index learned to filter on
                them. Each one now carries the reader to every other post
                that shares it. Tags are free text, so the value is encoded
                rather than trusted to be URL-safe the way a slug is. */}
            {tags?.length > 0 && (
              <ul className="post__tags">
                {tags.map(tag => (
                  <li key={tag}>
                    <Link to={`/blog/?tag=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Link>
                  </li>
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
      excerpt(pruneLength: 500, format: HTML)
      frontmatter {
        title
        date(formatString: "DD MMMM YYYY")
        description
        category
        tags
        image
      }
    }
  }
`

/* A post with its own hero image uses it as the social card; the rest fall
   back to the site card. The blurb is the post's own description when it has
   one, and otherwise the opening prose — see summarise() for why that comes
   from the HTML excerpt rather than the plain one. */
export const Head = ({ data }) => (
  <Seo
    title={data.markdownRemark.frontmatter.title}
    description={
      data.markdownRemark.frontmatter.description ||
      summarise(data.markdownRemark.excerpt)
    }
    image={data.markdownRemark.frontmatter.image}
  />
)

export default BlogPostTemplate
