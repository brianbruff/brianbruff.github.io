import * as React from "react"
import { chapters } from "../lib/site-links"

/**
 * The signal rail: a copper hairline down the left edge carrying a chapter
 * index, a travelling marker for page progress, and a red status LED that
 * lights only while a clip is actually being scrubbed.
 *
 * It is real instrumentation, not decoration — every tick is a link to its
 * chapter, and the readout says where you are.
 */
const SignalRail = () => {
  const railRef = React.useRef(null)
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const sections = chapters
      .map(c => document.getElementById(c.key))
      .filter(Boolean)
    let ticking = false

    const measure = () => {
      ticking = false
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      rail.style.setProperty(
        "--rail-progress",
        max > 0 ? (window.scrollY / max).toFixed(4) : "0"
      )

      /* Whichever chapter owns the middle of the viewport owns the index. */
      const mid = window.scrollY + window.innerHeight / 2
      let found = 0
      sections.forEach((section, i) => {
        if (section.offsetTop <= mid) found = i
      })
      setCurrent(found)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const pad = n => String(n).padStart(2, "0")

  return (
    <nav className="rail" ref={railRef} aria-label="Chapters">
      <span className="rail__marker" aria-hidden="true" />
      <ul className="rail__ticks">
        {chapters.map((chapter, i) => (
          <li key={chapter.key}>
            <a
              className="rail__tick"
              href={`#${chapter.key}`}
              aria-current={i === current ? "true" : "false"}
              aria-label={`Chapter ${i + 1}: ${chapter.label}`}
            >
              <span>{pad(i + 1)}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="rail__status" aria-hidden="true">
        <span className="rail__readout">
          {pad(current + 1)} / {pad(chapters.length)}
        </span>
        <span className="rail__led" />
      </div>
    </nav>
  )
}

export default SignalRail
