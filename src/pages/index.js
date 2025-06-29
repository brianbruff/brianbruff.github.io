import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const topics = [
  {
    text: "Software Architecture",
    description: "Insights into system design, patterns, and architectural decisions",
  },
  {
    text: "Development Practices",
    description: "Best practices, coding standards, and development methodologies",
  },
  {
    text: "Engineering Solutions",
    description: "Real-world problem solving and technical implementations",
  },
  {
    text: "Technology Stack",
    description: "Exploring modern technologies and tools in software development",
  },
]

const IndexPage = () => (
  <Layout>
    <div className={styles.textCenter}>
      <h1>
        Welcome to My Technical Blog
      </h1>
      <p className={styles.intro}>
        Software Architect • Developer • Engineer
      </p>
      <p>
        Sharing insights and experiences from the world of software development
      </p>
    </div>
    <div className={styles.list}>
      {topics.map(topic => (
        <div key={topic.text} className={styles.listItem}>
          <h3 className={styles.listItemLink}>
            {topic.text}
          </h3>
          <p className={styles.listItemDescription}>{topic.description}</p>
        </div>
      ))}
    </div>
    <div className={styles.textCenter}>
      <Link to="/blog" className={styles.button}>
        Read Latest Posts
      </Link>
    </div>
  </Layout>
)

export const Head = () => <Seo title="Brian Keating - Software Architect & Developer" />

export default IndexPage
