import * as React from "react"
import { Chapter, Media, Scrim } from "./stage"

const steps = [
  {
    label: "C++ / Banking systems",
    note: "Learning that reliability is not a feature you add later.",
  },
  {
    label: "Robotic factory automation",
    note: "Software connected to physical machines, feedback loops, and real operational consequences.",
  },
  {
    label: "Telecoms / distributed systems",
    note: "Working at network scale: services, integration, resilience, and observability.",
  },
  {
    label: "International energy projects",
    note: "Consulting across complex commodity and energy environments where technical decisions shape commercial outcomes.",
  },
  {
    label: "AI systems architecture",
    note: "Bringing multi-agent, multi-modal workflows into practical, robust delivery.",
  },
]

const stack = [
  "C++", "C#", ".NET", "Java", "TypeScript", "Angular", "Python",
  "AWS", "Azure", "Kubernetes", "Terraform", "Data platforms", "AI systems",
]

const Journey = () => (
  <Chapter id="journey" pin="journey" labelledBy="journey-heading">
    <Media name="walk" />
    <Scrim variant="top" />
    <div className="scrim scrim--left scrim--soft" aria-hidden="true" />
    <Scrim variant="right" />

    <div className="stage__overlay journey__overlay">
      <div className="journey__intro">
        <p className="eyebrow">Journey / Range</p>
        <h2 className="journey__heading" id="journey-heading">
          A career built close to the system.
        </h2>
      </div>

      <ol className="journey__list">
        {steps.map((step, i) => (
          <li
            key={step.label}
            className={`journey__item${i === 0 ? " is-active" : ""}`}
          >
            <span className="journey__index">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="journey__label">{step.label}</h3>
            <p className="journey__note">{step.note}</p>
          </li>
        ))}
      </ol>

      <div className="ribbon" data-ribbon="">
        <span className="meta ribbon__label">Working surface</span>
        <ul className="ribbon__list">
          {stack.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </Chapter>
)

export default Journey
