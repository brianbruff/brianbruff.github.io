import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import OutboundLink from "../components/outbound-link"
import { links } from "../site/links"
import { mountPortraitGreeting } from "../site/portrait-greeting"
import "../styles/resume.css"

const skills = [
  {
    title: "Cloud platforms",
    body: "Azure Certified AI Engineer, AWS Certified Solutions Architect",
  },
  {
    title: "Programming languages",
    body: ".NET (C#), Python, TypeScript, Java, VC++ (MFC, ATL, WTL COM+), Objective-C",
  },
  { title: "Web development", body: "Angular, NGRX, RxJS, NestJS, Ionic2" },
  {
    title: "Backend development",
    body: "ASP.net, FastAPI, Spring Boot, Drools, Camel, Node",
  },
  {
    title: "AI",
    body: "Agentic coding, AI agent development, Claude Agent SDK, agent harnesses, AWS Strands, Amazon Bedrock, Amazon Bedrock AgentCore, LangGraph",
  },
  {
    title: "DevOps & infrastructure",
    body: "Terraform, ARM, CloudFormation, SAM, CI/CD pipelines, Docker, Kubernetes (EKS/AKS)",
  },
  {
    title: "Real-time systems",
    body: "WebSockets, stream processing, event-driven architecture",
  },
  {
    title: "Application architecture",
    body: "Microservices, SOA, SaaS, workflow and BPM systems",
  },
  {
    title: "Business domains",
    body: "Workforce management, real-time data platforms, trading & risk, power & renewables",
  },
]

const strengths = [
  "Cloud adoption & Well-Architected Frameworks",
  "End-to-end product lifecycle: scoping → architecture → delivery",
  "Technical leadership with Agile/SCRUM, TDD, BDD, SecDevOps",
  "Scalable CI/CD automation and containerised deployment",
  "AI-first design thinking and innovation leveraging LangGraph & LLMs",
]

const achievements = [
  "Cloud adoption using Azure/AWS Well-Architected Frameworks",
  "Container & Kubernetes rollout (EKS, AKS, AKS ARM templates)",
  "Enterprise CI/CD pipeline automation",
  "International project deliveries with distributed teams",
  "Angular & real-time data platform implementation at scale",
  "GenAI rollout using RAG for intelligent data discovery, and promoting AI-first development with coding agents",
  "PileupBuster.com — ham radio pileup platform built entirely with AI assistance",
  "Founded and grew OpenHPSDR Zeus into a massively successful multiplatform SDR solution",
]

const ownership = [
  "Web stack modernisation & real-time data platforms",
  "Workflow business process automation",
  "HR time tracking solutions",
  "Ticket management systems",
  "PileupBuster.com — AI-built ham radio training platform",
]

const Section = ({ title, count, children }) => (
  <section className="resume__section">
    <div className="section-head">
      <h2 className="section-head__title">{title}</h2>
      {count && <span className="section-head__count">{count}</span>}
    </div>
    {children}
  </section>
)

const ResumePage = () => {
  React.useEffect(() => mountPortraitGreeting(), [])

  return (
    <Layout>
      <div className="page">
        <div className="page__inner">
          <header className="masthead resume__masthead">
            <img
              className="masthead__plate"
              src="/images/resume-hero.jpg"
              alt=""
              loading="eager"
              decoding="async"
            />
            <div className="resume__identity">
              {/* The still is the clip's final frame, so the plate reads the
                same whether the greeting plays, is refused, or never runs. */}
              <div className="resume__portrait">
                <img
                  className="resume__portrait-still"
                  src="/images/brian-portrait.jpg"
                  alt="Brian Keating"
                  width="620"
                  height="846"
                  loading="eager"
                  decoding="async"
                />
                <video
                  className="resume__portrait-clip"
                  data-portrait-clip=""
                  data-src="/assets/video/greeting.mp4"
                  data-src-mobile="/assets/video/greeting.mobile.mp4"
                  poster="/images/brian-portrait.jpg"
                  playsInline
                  muted
                  preload="none"
                  disablePictureInPicture
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
              <div>
                <p className="eyebrow">Résumé / Practice</p>
                <h1 className="masthead__title">Brian Keating</h1>
                <p className="resume__role">AI Systems Architect</p>
              </div>
            </div>
            <p className="masthead__intro">
              Cloud Solutions Architect certified in Azure and AWS, specialising
              in AI-first architectures and complex software solutions. Proven
              experience as Product Owner, Engineering Lead, and Consultant
              across global teams and domains. Passionate technologist with
              hands-on expertise spanning full-stack development, microservices,
              and distributed systems.
            </p>
          </header>

          <Section title="Technical skills" count={`${skills.length} areas`}>
            <div className="skills">
              {skills.map((skill, i) => (
                <article className="panel skills__item" key={skill.title}>
                  <span className="skills__index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="skills__title">{skill.title}</h3>
                  <p className="skills__body">{skill.body}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="Professional strengths">
            <ul className="marks">
              {strengths.map(item => (
                <li className="marks__item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Achievements" count={`${achievements.length} logged`}>
            <ul className="marks marks--two">
              {achievements.map(item => (
                <li className="marks__item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Product ownership">
            <ul className="marks">
              {ownership.map(item => (
                <li className="marks__item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <section className="resume__cta">
            <h2 className="resume__ctaHeading">Want the long version?</h2>
            <div className="actions">
              <OutboundLink className="btn" href={links.email}>
                Start a conversation&nbsp;↗
              </OutboundLink>
              <Link className="link" to="/blog/">
                Read the writing&nbsp;→
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Résumé"
    description="Brian Keating — AI Systems Architect. Cloud, distributed systems, and multi-agent AI delivery."
  />
)

export default ResumePage
