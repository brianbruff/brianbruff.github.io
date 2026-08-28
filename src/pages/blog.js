import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/blog.css"

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = React.useState(null)
  const [showAllTags, setShowAllTags] = React.useState(false)

  /* Seventeen years of posts tag the same subject several ways — "Azure" and
     "azure", "Java" and "java". Folding on a normalised key stops the filter
     listing what look like duplicates, and shows the spelling used most. */
  const normalise = tag => tag.trim().toLowerCase()

  const tagIndex = React.useMemo(() => {
    const map = new Map()
    posts.forEach(post => {
      ;(post.frontmatter.tags || []).forEach(tag => {
        const key = normalise(tag)
        if (!key) return
        const entry = map.get(key) || { count: 0, spellings: new Map() }
        entry.count += 1
        entry.spellings.set(tag, (entry.spellings.get(tag) || 0) + 1)
        map.set(key, entry)
      })
    })
    return [...map.entries()]
      .map(([key, entry]) => ({
        key,
        count: entry.count,
        label: [...entry.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0],
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  }, [posts])

  const popularTags = tagIndex.filter(tag => tag.count >= 2)
  const displayTags = showAllTags ? tagIndex : popularTags
  const selectedLabel = tagIndex.find(t => t.key === selectedTag)?.label

  const filteredPosts = React.useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter(post =>
      (post.frontmatter.tags || []).some(tag => normalise(tag) === selectedTag)
    )
  }, [posts, selectedTag])

  return (
    <Layout>
      <div className="page">
        <div className="page__inner">
          <header className="masthead">
            <img
              className="masthead__plate"
              src="/images/writing-hero.jpg"
              alt=""
              loading="eager"
              decoding="async"
            />
            <p className="eyebrow">Writing / Archive</p>
            <h1 className="masthead__title">Notes from close to the system.</h1>
            <p className="masthead__intro">
              Seventeen years of working notes on architecture, distributed
              systems, and now AI — written while building, not after.
            </p>
          </header>

          <div className="section-head">
            <h2 className="section-head__title">
              {selectedLabel || "All posts"}
            </h2>
            <span className="section-head__count">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {displayTags.length > 0 && (
            <div className="tags">
              <button
                type="button"
                className={`tag${!selectedTag ? " is-active" : ""}`}
                onClick={() => setSelectedTag(null)}
                aria-pressed={!selectedTag}
              >
                All
              </button>
              {displayTags.map(tag => (
                <button
                  type="button"
                  key={tag.key}
                  className={`tag${selectedTag === tag.key ? " is-active" : ""}`}
                  onClick={() => setSelectedTag(tag.key)}
                  aria-pressed={selectedTag === tag.key}
                >
                  {tag.label}
                  <span className="tag__count">{tag.count}</span>
                </button>
              ))}
              {popularTags.length < tagIndex.length && (
                <button
                  type="button"
                  className="tag tag--more"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? "Fewer tags" : `All ${tagIndex.length} tags`}
                </button>
              )}
            </div>
          )}

          <ol className="posts">
            {filteredPosts.map(post => (
              <li key={post.id} className="posts__item">
                <Link className="post-row" to={post.fields?.slug || "#"}>
                  <time className="post-row__date">{post.frontmatter.date}</time>
                  <div className="post-row__body">
                    <h3 className="post-row__title">{post.frontmatter.title}</h3>
                    <p className="post-row__excerpt">
                      {post.frontmatter.description || post.excerpt}
                    </p>
                    {post.frontmatter.tags?.length > 0 && (
                      <ul className="post-row__tags">
                        {post.frontmatter.tags.map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="post-row__cue" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {filteredPosts.length === 0 && (
            <p className="posts__empty">No posts carry that tag yet.</p>
          )}
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
        excerpt(pruneLength: 220)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMM YYYY")
          title
          description
          tags
        }
      }
    }
  }
`

export const Head = () => (
  <Seo
    title="Writing"
    description="Notes on software architecture, distributed systems and AI systems delivery, by Brian Keating."
  />
)

export default BlogPage
