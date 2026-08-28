import * as React from "react"
import { Chapter, Media, Scrim } from "./stage"

const taglines = [
  "Architecture with range.",
  "From C++ systems to AI agents.",
  "Making complexity useful.",
  "Built for the real world.",
]

const Hero = () => (
  <Chapter id="hero" pin="hero" labelledBy="hero-title">
    <Media name="intro" eager />
    <Scrim variant="top" />
    <Scrim variant="bottom" />

    <div className="stage__overlay hero__overlay">
      <div className="hero__meta">
        <span className="meta">Independent consultant · Ireland</span>
        <span className="meta" aria-hidden="true">
          01 / Orbit
        </span>
      </div>

      <div />

      <div className="hero__block">
        <p className="hero__ghost" aria-hidden="true">
          AI SYSTEMS
        </p>
        <h1 className="hero__title" id="hero-title">
          <span>Brian</span>
          <span>Keating</span>
        </h1>
        <p className="hero__role">AI Systems Architect</p>
        <p className="hero__support">
          Designing multi-agent, multi-model systems for complex,
          high-consequence work.
        </p>

        <div className="hero__taglines">
          {taglines.map((line, i) => (
            <span
              key={line}
              className={`hero__tagline${i === 0 ? " is-active" : ""}`}
            >
              {line}
            </span>
          ))}
        </div>

        <div className="hero__foot">
          <span className="meta hero__cue">Scroll to enter&nbsp;→</span>
        </div>
      </div>
    </div>
  </Chapter>
)

export default Hero
