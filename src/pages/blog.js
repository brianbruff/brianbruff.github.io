import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = React.useState(null)
  const [showAllTags, setShowAllTags] = React.useState(false)

  const tagCounts = React.useMemo(() => {
    const counts = {}
    posts.forEach(post => {
      const tags = post.frontmatter.tags || []
      tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [posts])

  const popularTags = tagCounts.filter(([tag, count]) => count >= 2)
  const displayTags = showAllTags ? tagCounts : popularTags

  const filteredPosts = React.useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter(post =>
      (post.frontmatter.tags || []).includes(selectedTag),
    )
  }, [posts, selectedTag])

  return (
    <Layout>
      <div className="animate-fadeInUp blog-page-container">
        <h1>Latest Blog Posts</h1>
        <p>
          Sharing thoughts and experiences about software architecture,
          development practices, and engineering solutions.
        </p>

        {displayTags.length > 0 && (
          <div className="tag-wall">
            <div className="tag-filter">
              <button
                className={`tag-btn ${!selectedTag ? "active" : ""}`}
                onClick={() => setSelectedTag(null)}
              >
                All Posts
              </button>
              {displayTags.map(([tag, count]) => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
            {popularTags.length < tagCounts.length && (
              <button
                className="show-all-tags-btn"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags
                  ? "Show fewer tags"
                  : `Show all tags (${tagCounts.length})`}
              </button>
            )}
          </div>
        )}

        <div className={styles.list}>
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={post.fields?.slug || "#"}
              className={`blog-card glass-card animate-fadeInUp blog-card-link`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h2>
                <span className="blog-link">{post.frontmatter.title}</span>
              </h2>
              <small className="blog-date">{post.frontmatter.date}</small>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="post-tags">
                  {post.frontmatter.tags.map(tag => (
                    <span key={tag} className="post-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="blog-excerpt">
                {post.frontmatter.description || post.excerpt}
              </p>
            </Link>
          ))}
          {filteredPosts.length === 0 && (
            <p className="no-posts">No posts found with this tag.</p>
          )}
        </div>
        <div className={styles.textCenter}>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt(pruneLength: 250)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`

export const Head = () => <Seo title="Blog - Brian Keating" />

export default BlogPage
