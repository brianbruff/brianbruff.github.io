import * as React from "react"
import { Chapter, Media, Scrim } from "./stage"

const Work = () => (
  <Chapter id="work" pin="work" labelledBy="work-heading">
    <Media name="coding" />
    <Scrim variant="top" />
    <Scrim variant="left" />
    <Scrim variant="bottom" />

    <div className="stage__overlay work__overlay">
      <div className="work__copy">
        <p className="eyebrow">Now / Orchestration</p>
        <h2 className="work__heading" id="work-heading">
          Multi-agent systems, built to make better decisions.
        </h2>
        <p className="lead">
          I design and deliver AI systems that bring the right models, tools,
          context, and evaluation together — turning complex operational and
          market information into useful, dependable outcomes.
        </p>
        <p className="work__callout">
          International energy consulting → AI-native delivery
        </p>
      </div>

      <figure className="topology">
        <figcaption className="visually-hidden">
          System topology: a signal is enriched with context, routed through a
          team of agents, gated by evaluation, and resolved into a decision.
        </figcaption>
        <svg className="topology__svg" viewBox="0 0 480 274" role="img"
        aria-label="Signal, then context, then agent team, then evaluation, then decision">
        {/* routing */}
        <path className="topology__path topology__path--live" data-step="1" d="M57 150 C 100 150, 104 80, 142 80"/>
        <path className="topology__path topology__path--live" data-step="1" d="M57 150 H142"/>
        <path className="topology__path topology__path--live" data-step="1" d="M57 150 C 100 150, 104 220, 142 220"/>
        <path className="topology__path topology__path--live" data-step="2" d="M158 80 C 198 80, 200 150, 236 150"/>
        <path className="topology__path topology__path--live" data-step="2" d="M158 150 H236"/>
        <path className="topology__path topology__path--live" data-step="2" d="M158 220 C 198 220, 200 150, 236 150"/>
        <path className="topology__path" d="M244 70 H236 V230 H244"/>
        <path className="topology__path" d="M294 70 H302 V230 H294"/>
        <path className="topology__path" d="M236 88 H250"/>
        <path className="topology__path" d="M236 150 H250"/>
        <path className="topology__path" d="M236 212 H250"/>
        <path className="topology__path" d="M294 88 H302"/>
        <path className="topology__path" d="M294 150 H302"/>
        <path className="topology__path" d="M294 212 H302"/>
        <path className="topology__path topology__path--live" data-step="3" d="M302 150 H362"/>
        <path className="topology__path topology__path--live" data-step="4" d="M398 150 H439"/>
        {/* 0 · signal */}
        <g className="topology__group" data-step="0">
        <rect className="topology__node" x="31" y="137" width="26" height="26"/>
        <circle className="topology__dot" cx="44" cy="150" r="3"/>
        <text className="topology__label" x="44" y="256" textAnchor="middle">Signal</text>
        </g>
        {/* 1 · context */}
        <g className="topology__group" data-step="1">
        <text className="topology__sub" x="150" y="64" textAnchor="middle">history</text>
        <rect className="topology__node" x="142" y="72" width="16" height="16"/>
        <text className="topology__sub" x="150" y="134" textAnchor="middle">research</text>
        <rect className="topology__node" x="142" y="142" width="16" height="16"/>
        <text className="topology__sub" x="150" y="204" textAnchor="middle">domain</text>
        <rect className="topology__node" x="142" y="212" width="16" height="16"/>
        <text className="topology__label" x="150" y="256" textAnchor="middle">Context</text>
        </g>
        {/* 2 · agent team */}
        <g className="topology__group" data-step="2">
        <rect className="topology__node" x="250" y="79" width="44" height="18"/>
        <text className="topology__sub" x="272" y="92" textAnchor="middle">plan</text>
        <rect className="topology__node" x="250" y="141" width="44" height="18"/>
        <text className="topology__sub" x="272" y="154" textAnchor="middle">tools</text>
        <rect className="topology__node" x="250" y="203" width="44" height="18"/>
        <text className="topology__sub" x="272" y="216" textAnchor="middle">critic</text>
        <text className="topology__label" x="272" y="256" textAnchor="middle">Agent team</text>
        </g>
        {/* 3 · evaluation */}
        <g className="topology__group" data-step="3">
        <path className="topology__node" d="M380 132 L398 150 L380 168 L362 150 Z"/>
        <text className="topology__label" x="380" y="256" textAnchor="middle">Evaluation</text>
        </g>
        {/* 4 · decision */}
        <g className="topology__group" data-step="4">
        <rect className="topology__node" x="439" y="137" width="26" height="26"/>
        <circle className="topology__dot" cx="452" cy="150" r="3"/>
        <text className="topology__label" x="452" y="256" textAnchor="middle">Decision</text>
        </g>
        </svg>
      </figure>
    </div>
  </Chapter>
)

export default Work
