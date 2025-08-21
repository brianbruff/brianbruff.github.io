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
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="text-gradient">Brian Keating</span>
          <span className="text-emphasis">Technical Blog</span>
        </h1>
        <p className="hero-subtitle">Cloud Solutions Architect • AI Engineer • Full-Stack Developer</p>
        <p className="hero-description">
          Sharing insights and experiences from the world of software development, 
          cloud architecture, and AI-first solutions.
        </p>
      </div>
      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <div className="scroll-indicator"></div>
      </div>
    </section>

    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explore My Work</h2>
          <p className="section-subtitle">Technical insights, professional experience, and thought leadership</p>
        </div>
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
