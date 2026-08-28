import * as React from "react"

/**
 * One chapter of the scroll story.
 *
 * The section is tall; the stage inside it is sticky. CSS does the pinning —
 * it survives mobile browser chrome and dynamic viewport units in a way
 * transform-based pinning does not — and ScrollTrigger only reads progress.
 */
export const Chapter = ({ id, pin, children, labelledBy }) => (
  <section
    className="chapter"
    id={id}
    data-chapter={id}
    style={{ "--pin": `var(--pin-${pin})` }}
    aria-labelledby={labelledBy}
  >
    <div className="stage">{children}</div>
  </section>
)

/**
 * The clip for a chapter. Only the hero is fetched up front (`eager`); the
 * rest are attached by IntersectionObserver just before they are needed.
 * The poster stays behind the video, so a slow or failed load leaves a
 * composed still rather than black.
 */
export const Media = ({ name, eager = false, className = "stage__media" }) => (
  <div className={className}>
    <img
      className="stage__poster"
      src={`/assets/poster/${name}.jpg`}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
    <video
      className="stage__video"
      playsInline
      muted
      preload={eager ? "auto" : "none"}
      disablePictureInPicture
      poster={`/assets/poster/${name}.jpg`}
      data-scrub=""
      data-src={`/assets/video/${name}.mp4`}
      data-src-mobile={`/assets/video/${name}.mobile.mp4`}
      {...(eager ? { "data-eager": "" } : {})}
      aria-hidden="true"
      tabIndex={-1}
    />
  </div>
)

export const Scrim = ({ variant }) => (
  <div className={`scrim scrim--${variant}`} aria-hidden="true" />
)
