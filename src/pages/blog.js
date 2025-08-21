import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <div className="animate-fadeInUp">
        <h1>Latest Blog Posts</h1>
        <p>
          Sharing thoughts and experiences about software architecture, development practices, 
          and engineering solutions.
        </p>
        <div className={styles.list}>
          {posts.map((post, index) => (
            <article key={post.id} className={`${styles.listItem} content-card animate-fadeInUp`} style={{animationDelay: `${index * 0.05}s`}}>
              <h2>
                <Link to={post.fields?.slug || '#'} className={styles.listItemLink}>
                  {post.frontmatter.title}
                </Link>
              </h2>
              <small style={{color: 'var(--color-primary)'}}>{post.frontmatter.date}</small>
              <p>{post.frontmatter.description || post.excerpt}</p>
            </article>
          ))}
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
        }
      }
    }
  }
`

export const Head = () => <Seo title="Blog - Brian Keating" />

export default BlogPage