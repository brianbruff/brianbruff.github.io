/**
 * The résumé portrait's greeting.
 *
 * The plate ships as a still. When motion is allowed, the clip plays once per
 * page load — a breath, a nod, and back to rest — and then stops on its final
 * frame.
 *
 * Two rules govern it:
 *   1. The clip's last frame *is* the still. It was extracted from the encode,
 *      so the video freezing and the poster showing are the same picture and
 *      the plate never pops when playback ends.
 *   2. Anything unavailable — reduced motion, no JS, a blocked autoplay, a
 *      failed fetch — leaves the still exactly as rendered. Nothing to undo.
 */

/* Held back a beat so the greeting lands on a settled page rather than
 * competing with the masthead's own first paint. */
const LEAD_IN_MS = 360

/* Same test the scroll story uses: data-saver and 2g take the small encode
 * regardless of viewport, because the constraint is the pipe, not the screen. */
function wantsLightweight() {
  const c = navigator.connection
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return true
  return window.matchMedia("(max-width: 860px)").matches
}

export function mountPortraitGreeting() {
  const video = document.querySelector("[data-portrait-clip]")
  if (!video) return undefined

  if (document.documentElement.dataset.motion !== "full") return undefined

  const src =
    (wantsLightweight() && video.dataset.srcMobile) || video.dataset.src
  if (!src) return undefined

  let timer = null
  let cancelled = false

  /* The clip is left on its final frame deliberately — that frame is the
   * still, so there is nothing to swap back to when it ends. */
  const onError = () => {
    video.hidden = true
  }

  video.addEventListener("error", onError)

  timer = window.setTimeout(() => {
    if (cancelled) return
    video.src = src
    const played = video.play()
    /* Autoplay can still be refused even muted. A rejection is a normal
     * outcome, not a failure: the poster is already the right picture. */
    if (played && typeof played.catch === "function") {
      played.catch(() => {})
    }
  }, LEAD_IN_MS)

  return () => {
    cancelled = true
    if (timer) window.clearTimeout(timer)
    video.removeEventListener("error", onError)
    video.pause()
  }
}
