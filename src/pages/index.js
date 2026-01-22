import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/homepage.css"

const services = [
  {
    icon: "🏗️",
    title: "Software Architecture",
    description:
      "Design robust, scalable systems that power enterprise applications. Expert in microservices, event-driven architectures, and distributed systems.",
    link: "/blog",
    linkText: "Explore Articles",
    span: 2,
  },
  {
    icon: "☁️",
    title: "Cloud Solutions",
    description:
      "Azure & AWS certified architect specializing in cloud-native applications, serverless, and container orchestration.",
    link: "/blog",
    linkText: "View Cloud Services",
    span: 1,
  },
  {
    icon: "🤖",
    title: "AI Integration",
    description:
      "Leverage machine learning and AI to build intelligent applications that automate processes and provide insights.",
    link: "/blog",
    linkText: "Explore AI",
    span: 1,
  },
  {
    icon: "💻",
    title: "Development",
    description:
      "Full-stack development with modern frameworks. Clean code, testing, and CI/CD pipelines are my standard.",
    link: "/blog",
    linkText: "View Projects",
    span: 1,
  },
  {
    icon: "📊",
    title: "Data Engineering",
    description:
      "Build data pipelines, warehouses, and analytics platforms that turn raw data into actionable insights.",
    link: "/blog",
    linkText: "Learn More",
    span: 1,
  },
  {
    icon: "🔒",
    title: "Security & Compliance",
    description:
      "Implement security best practices and ensure compliance with industry standards. From authentication to data encryption, security is built in, not added on.",
    link: "/blog",
    linkText: "Security Overview",
    span: 2,
  },
]

const IndexPage = () => (
  <Layout>
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Software Architect & Developer
        </div>
        <h1 className="hero-title">Building the Future</h1>
        <p className="hero-subtitle">Cloud, AI, and Enterprise Solutions</p>
        <p className="hero-description">
          I transform complex business requirements into elegant, scalable
          software solutions. Specializing in cloud architecture, system design,
          and modern development practices.
        </p>
        <div className="hero-buttons">
          <Link to="/blog" className="btn btn-primary">
            Read Blog
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/resume" className="btn btn-secondary">
            View Resume
          </Link>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-mouse"></div>
        <span>Scroll</span>
      </div>
    </section>

    <section className="section" id="services">
      <div className="section-header">
        <span className="section-label">What I Do</span>
        <h2 className="section-title">Services & Expertise</h2>
        <p className="section-description">
          Delivering innovative solutions across the full software development
          lifecycle
        </p>
      </div>

      <div className="bento-grid">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={`bento-card ${service.span === 2 ? "span-2" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bento-card-content">
              <div className="card-icon">{service.icon}</div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description">{service.description}</p>
              <Link to={service.link} className="card-link">
                {service.linkText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
)

export const Head = () => (
  <Seo title="Brian Keating - Software Architect & Developer" />
)

export default IndexPage
