import * as React from "react"
import { Chapter, Media, Scrim } from "./stage"

const phrases = [
  "Multiple signals",
  "Specialist context",
  "Robust evaluation",
  "Better decisions",
]

const Commodity = () => (
  <Chapter id="commodity" pin="commodity" labelledBy="commodity-heading">
    <Scrim variant="top" />

    {/* Traces are drawn deterministically at mount, not authored here. */}
    <div className="traces" data-traces="" aria-hidden="true">
      <svg className="traces__svg" viewBox="0 0 1000 220" preserveAspectRatio="none" />
    </div>

    <div className="stage__overlay plate__overlay plate__overlay--flip">
      <div className="plate__copy">
        <p className="eyebrow">Commodity intelligence / In progress</p>
        <h2 className="plate__heading" id="commodity-heading">
          From market noise to considered analysis.
        </h2>
        <div className="plate__body">
          <p>
            A robust AI analysis harness for commodities: bringing together
            signals, research, specialist context, and disciplined evaluation to
            produce deeper, more dependable insight.
          </p>
        </div>

        <ul className="phrases">
          {phrases.map(item => (
            <li key={item} className="phrases__item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Media name="commodity" className="plate__frame stage__media" />
    </div>
  </Chapter>
)

export default Commodity
