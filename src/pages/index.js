import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/homepage.css"

const services = [
  {
    icon: "🏗️",
    title: "Software Architecture",
    description: "Insights into system design, patterns, and architectural decisions",
    link: "/blog",
    linkText: "Explore Articles"
  },
  {
    icon: "💻",
    title: "Development Practices",
    description: "Best practices, coding standards, and development methodologies",
    link: "/blog",
    linkText: "Read More"
  },
  {
    icon: "⚙️",
    title: "Engineering Solutions",
    description: "Real-world problem solving and technical implementations",
    link: "/blog",
    linkText: "View Solutions"
  },
  {
    icon: "🚀",
    title: "Technology Stack",
    description: "Exploring modern technologies and tools in software development",
    link: "/blog",
    linkText: "Discover Tech"
  },
  {
    icon: "📝",
    title: "Blog",
    description: "Latest posts about cloud architecture, AI, and software development",
    link: "/blog",
    linkText: "Read Blog"
  },
  {
    icon: "👨‍💼",
    title: "Resume",
    description: "Cloud Solutions Architect certified in Azure and AWS",
    link: "/resume",
    linkText: "View Resume"
  },
]

const IndexPage = () => (
  <Layout>
    <section className="services" id="services">
      <div className="container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.title} className="service-card glass-card" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={service.link} className="service-link">
                {service.linkText} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
)

export const Head = () => <Seo title="Brian Keating - Software Architect & Developer" />

export default IndexPage
