import * as React from "react"
import { Chapter, Media, Scrim } from "./stage"
import OutboundLink from "../outbound-link"
import { links } from "../../lib/site-links"

const features = [
  "Modern SDR experience",
  "Multi-platform, multi-device",
  "Open source, built in public",
]

const OpenSource = () => (
  <Chapter id="open-source" pin="source" labelledBy="zeus-heading">
    <Scrim variant="top" />

    <div className="stage__overlay plate__overlay">
      <Media name="zeus" className="plate__frame stage__media" />

      <div className="plate__copy">
        <p className="eyebrow">Open source / Signal</p>
        <h2 className="plate__heading" id="zeus-heading">
          Zeus: rebuilding a specialist tool for the modern radio world.
        </h2>
        <div className="plate__body">
          <p>
            I founded and grew Zeus into a modern SDR application for the
            OpenHPSDR ecosystem — moving a specialist category beyond its 1990s
            desktop roots toward a progressive, multi-platform, multi-device
            experience.
          </p>
          <p>
            Zeus is used across the amateur-radio community and recognised by
            Apache Labs, a flagship provider of OpenHPSDR hardware. The work is
            as much about preserving a serious technical platform as it is about
            making it feel alive for its next generation of users.
          </p>
        </div>

        <ul className="features">
          {features.map(item => (
            <li key={item} className="features__item">
              {item}
            </li>
          ))}
        </ul>

        <p className="plate__actions">
          <OutboundLink className="btn btn--ghost" href={links.zeus}>
            Explore on GitHub&nbsp;↗
          </OutboundLink>
        </p>
      </div>
    </div>
  </Chapter>
)

export default OpenSource
