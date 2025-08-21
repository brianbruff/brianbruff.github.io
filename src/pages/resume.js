import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/resume.css"

const ResumePage = () => {
  return (
    <Layout>
      <div className="resume-container">
        <div className="resume-hero glass-morphism">
          <h1 className="resume-title">Brian Keating</h1>
          <p className="resume-subtitle">Cloud Solutions Architect</p>
          <p className="resume-intro">
            Cloud Solutions Architect certified in Azure and AWS, specializing in AI-first architectures 
            and complex software solutions. Proven experience as Product Owner, Engineering Lead, and 
            Consultant across global teams and domains. Passionate technologist with hands-on expertise 
            spanning full-stack development, microservices, and distributed systems.
          </p>
        </div>

        <section className="resume-section glass-morphism">
          <h2 className="section-title">Technical Skills & Experience</h2>
          <div className="skills-grid">
            <div className="skill-item">
              <span className="skill-icon">☁️</span>
              <h3>Cloud Platforms</h3>
              <p>Azure Certified AI Engineer, AWS Certified Solutions Architect</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">💻</span>
              <h3>Programming Languages</h3>
              <p>.NET (C#), Python, TypeScript, Java, VC++ (MFC, ATL, WTL COM+), Objective-C</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🌐</span>
              <h3>Web Development</h3>
              <p>Angular, NGRX, RxJS, NestJS, Ionic2</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">⚙️</span>
              <h3>Backend Development</h3>
              <p>ASP.net, FastAPI, Spring Boot, Drools, Camel, Node</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🤖</span>
              <h3>AI & ML</h3>
              <p>Azure AI, LangGraph, Generative AI-first solutions, OpenAI, Anthropic</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🔧</span>
              <h3>DevOps & Infrastructure</h3>
              <p>Terraform, ARM, CloudFormation, SAM, CI/CD Pipelines, Docker, Kubernetes (EKS/AKS)</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">⚡</span>
              <h3>Real-Time Systems</h3>
              <p>WebSockets, Stream Processing, Event-Driven Architecture</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🏗️</span>
              <h3>Application Architecture</h3>
              <p>Microservices, SOA, SaaS, Workflow and BPM Systems</p>
            </div>
            <div className="skill-item">
              <span className="skill-icon">💼</span>
              <h3>Business Domains</h3>
              <p>Workforce management, Real-Time data platforms, HR time tracking</p>
            </div>
          </div>
        </section>

        <section className="resume-section glass-morphism">
          <h2 className="section-title">Professional Strengths</h2>
          <div className="strengths-list">
            <div className="strength-item">
              <span className="strength-bullet">🔹</span>
              <p>Cloud adoption & Well-Architected Frameworks</p>
            </div>
            <div className="strength-item">
              <span className="strength-bullet">🔹</span>
              <p>End-to-end product lifecycle: Scoping → Architecture → Delivery</p>
            </div>
            <div className="strength-item">
              <span className="strength-bullet">🔹</span>
              <p>Technical leadership with Agile/SCRUM, TDD, BDD, SecDevOps</p>
            </div>
            <div className="strength-item">
              <span className="strength-bullet">🔹</span>
              <p>Scalable CI/CD automation and containerized deployment</p>
            </div>
            <div className="strength-item">
              <span className="strength-bullet">🔹</span>
              <p>AI-first design thinking and innovation leveraging LangGraph & LLMs</p>
            </div>
          </div>
        </section>

        <section className="resume-section glass-morphism">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <span className="achievement-icon">🏆</span>
              <p>Cloud adoption using Azure/AWS Well-Architected Frameworks</p>
            </div>
            <div className="achievement-card">
              <span className="achievement-icon">🏆</span>
              <p>Container & Kubernetes rollout (EKS, AKS, AKS ARM templates)</p>
            </div>
            <div className="achievement-card">
              <span className="achievement-icon">🏆</span>
              <p>Enterprise CI/CD pipeline automation</p>
            </div>
            <div className="achievement-card">
              <span className="achievement-icon">🏆</span>
              <p>International project deliveries with distributed teams</p>
            </div>
            <div className="achievement-card">
              <span className="achievement-icon">🏆</span>
              <p>Angular & real-time data platform implementation at scale</p>
            </div>
          </div>
        </section>

        <section className="resume-section glass-morphism">
          <h2 className="section-title">Product Ownership</h2>
          <div className="product-list">
            <div className="product-item">
              <span className="product-bullet">🔸</span>
              <p>Web stack modernization & real-time data platforms</p>
            </div>
            <div className="product-item">
              <span className="product-bullet">🔸</span>
              <p>Workflow business process automation</p>
            </div>
            <div className="product-item">
              <span className="product-bullet">🔸</span>
              <p>HR time tracking solutions</p>
            </div>
            <div className="product-item">
              <span className="product-bullet">🔸</span>
              <p>Ticket management systems</p>
            </div>
          </div>
        </section>

        <div className="resume-cta glass-morphism">
          <Link to="/blog" className="cta-button">Read My Blog</Link>
          <a href="mailto:contact@briankeating.net" className="cta-button secondary">Get In Touch</a>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Resume - Brian Keating" />

export default ResumePage