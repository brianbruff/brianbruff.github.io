/**
 * The homepage scroll story: lazy media, the scrub engine, and the per-chapter
 * progress handlers.
 *
 * React renders the markup; this mounts the behaviour onto it once and returns
 * a teardown. Nothing here re-renders, so driving the DOM directly is both
 * cheaper and simpler than threading scroll progress through component state.
 *
 * Two rules govern the scrub:
 *   1. Scroll handlers never touch the DOM. ScrollTrigger writes a target
 *      number; one requestAnimationFrame loop eases the actual currentTime
 *      toward it. Seeking stays off the scroll thread, and the motion reads
 *      like a shuttle rather than a step function.
 *   2. Nothing ever plays. These clips are timelines, not background video.
 */

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

/* ---------------------------------------------------------------- media --- */

function createMedia() {
  const clips = []
  let frame = null
  let last = 0
  let primed = false
  const mobile = window.matchMedia("(max-width: 860px)")

  /* Slow connections and data-saver get the small encodes regardless of size. */
  function wantsLightweight() {
    const c = navigator.connection
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return true
    return mobile.matches
  }

  function register(el) {
    const clip = {
      el,
      target: 0,
      current: 0,
      duration: 0,
      ready: false,
      failed: false,
      attached: false,
      active: false,
    }
    clips.push(clip)
    el.__clip = clip
    if (el.hasAttribute("data-eager")) attach(clip)
    return clip
  }

  function attach(clip) {
    if (clip.attached || clip.failed) return
    clip.attached = true

    const el = clip.el
    const src = (wantsLightweight() && el.dataset.srcMobile) || el.dataset.src

    el.addEventListener(
      "loadeddata",
      () => {
        clip.duration = isFinite(el.duration) && el.duration > 0 ? el.duration : 0
        if (!clip.duration) return fail(clip)
        clip.ready = true
        el.classList.add("is-ready")
        seek(clip, clip.target)
      },
      { once: true }
    )
    el.addEventListener("error", () => fail(clip), { once: true })

    el.preload = "auto"
    el.src = src
    el.load()
  }

  /* A clip that cannot decode leaves its poster in place. The chapter still
     reads: the copy, the scrims and the reveals do not depend on video. */
  function fail(clip) {
    clip.failed = true
    clip.ready = false
    clip.el.classList.remove("is-ready")
    clip.el.removeAttribute("src")
  }

  /* iOS will not paint a seek on a video that has never been handed to the
     decoder. One muted play/pause on the first gesture unlocks it. */
  function prime() {
    if (primed) return
    primed = true
    clips.forEach(clip => {
      if (!clip.attached || clip.failed) return
      const p = clip.el.play()
      if (p && p.then) p.then(() => clip.el.pause(), () => {})
      else clip.el.pause()
    })
  }

  function seek(clip, progress) {
    if (!clip.ready) return
    const t = clamp(progress, 0, 1) * clip.duration
    /* Half a frame at 24fps. Below this the decoder work is wasted. */
    if (Math.abs(t - clip.el.currentTime) < 0.02) return
    if (mobile.matches && clip.el.seeking) return
    try {
      clip.el.currentTime = t
    } catch (e) {
      /* seek raced a reload */
    }
  }

  function start() {
    if (frame === null) {
      last = 0
      frame = requestAnimationFrame(tick)
    }
  }

  function tick(now) {
    const dt = last ? Math.min(now - last, 64) : 16.7
    last = now

    let working = false
    let live = false

    for (const clip of clips) {
      if (!clip.active && Math.abs(clip.target - clip.current) < 0.0005) continue

      const delta = clip.target - clip.current
      if (Math.abs(delta) < 0.0004) {
        clip.current = clip.target
      } else {
        /* Frame-rate independent exponential ease, 0.14 per 60fps frame. */
        clip.current += delta * (1 - Math.pow(1 - 0.14, dt / 16.7))
        working = true
        if (Math.abs(delta) > 0.0025) live = true
      }
      seek(clip, clip.current)
    }

    document.documentElement.classList.toggle("is-scrubbing", live)
    frame = working ? requestAnimationFrame(tick) : null
  }

  return {
    register,
    attach: el => el && el.__clip && attach(el.__clip),
    prime,
    setProgress(el, progress) {
      const clip = el && el.__clip
      if (!clip) return
      clip.target = progress
      start()
    },
    setActive(el, isActive) {
      const clip = el && el.__clip
      if (!clip) return
      clip.active = isActive
      if (isActive) {
        attach(clip)
        start()
      }
    },
    destroy() {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      document.documentElement.classList.remove("is-scrubbing")
      clips.forEach(clip => {
        clip.el.removeAttribute("src")
        delete clip.el.__clip
      })
      clips.length = 0
    },
  }
}

/* ------------------------------------------------------------- chapters --- */

function revealTo(items, thresholds, progress, cls) {
  items.forEach((el, i) => el.classList.toggle(cls, progress >= thresholds[i]))
}

const handlers = {
  hero(section) {
    const title = section.querySelector(".hero__title")
    const ghost = section.querySelector(".hero__ghost")
    const lines = [...section.querySelectorAll(".hero__tagline")]
    const stops = [0, 0.28, 0.52, 0.76]
    let shown = -1

    return p => {
      /* Letters track in and settle across the opening of the orbit. */
      const track = (1 - clamp(p / 0.35, 0, 1)) * 0.085
      title.style.setProperty("--track", `${track.toFixed(4)}em`)
      ghost.style.setProperty("--ghost-shift", `${(p * 90).toFixed(1)}px`)

      let idx = 0
      for (let i = stops.length - 1; i >= 0; i--) {
        if (p >= stops[i]) {
          idx = i
          break
        }
      }
      if (idx !== shown) {
        shown = idx
        lines.forEach((el, j) => el.classList.toggle("is-active", j === idx))
      }
    }
  },

  journey(section) {
    const items = [...section.querySelectorAll(".journey__item")]
    const ribbon = section.querySelector("[data-ribbon]")
    const span = 0.17 /* five steps, ending near 0.85 */
    let active = -1

    return p => {
      const idx = clamp(Math.floor(p / span), 0, items.length - 1)
      if (idx !== active) {
        active = idx
        items.forEach((el, i) => {
          el.classList.toggle("is-active", i === idx)
          el.classList.toggle("is-past", i < idx)
        })
      }
      ribbon.classList.toggle("is-revealed", p >= 0.8)
    }
  },

  work(section) {
    const groups = [...section.querySelectorAll(".topology__group")]
    const paths = [...section.querySelectorAll(".topology__path--live")]

    /* Measure once so the draw-on stays a pure custom-property write. */
    paths.forEach(path =>
      path.style.setProperty("--len", path.getTotalLength().toFixed(1))
    )

    return p => {
      const pos = p * groups.length /* 0 → 5, one unit per stage */
      groups.forEach(g =>
        g.classList.toggle("is-live", pos >= Number(g.dataset.step) + 0.05)
      )
      paths.forEach(path => {
        const step = Number(path.dataset.step)
        path.style.setProperty("--flow", clamp(pos - (step - 1), 0, 1).toFixed(3))
      })
    }
  },

  "open-source"(section) {
    const items = [...section.querySelectorAll(".features__item")]
    return p => revealTo(items, [0.28, 0.46, 0.64], p, "is-revealed")
  },

  commodity(section) {
    const items = [...section.querySelectorAll(".phrases__item")]
    const svg = section.querySelector("[data-traces] svg")
    const noise = buildTraces(svg)

    return p => {
      revealTo(items, [0.18, 0.36, 0.54, 0.72], p, "is-revealed")
      if (!svg) return

      /* Scattered traces settle toward, and resolve into, one signal. */
      const cohere = clamp((p - 0.2) / 0.62, 0, 1)
      svg.style.setProperty("--cohere", cohere.toFixed(3))
      noise.forEach((path, i) =>
        path.style.setProperty("--drift", ((i - 2) * 26 * (1 - cohere)).toFixed(1))
      )
    }
  },
}

/* Deterministic traces — the same drawing on every load, so there is no
   runtime randomness that can produce an ugly frame once in a while. */
function buildTraces(svg) {
  if (!svg || svg.querySelector("path")) return []
  const W = 1000
  const H = 220
  const STEPS = 64
  let seed = 20260827
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  const line = (jitter, base) => {
    let d = ""
    let y = base
    for (let i = 0; i <= STEPS; i++) {
      y += (rand() - 0.5) * jitter
      y += (base - y) * 0.06 /* soft pull back to the mean */
      d += `${i ? "L" : "M"}${((i / STEPS) * W).toFixed(1)} ${clamp(y, 8, H - 8).toFixed(1)} `
    }
    return d.trim()
  }

  const ns = "http://www.w3.org/2000/svg"
  const made = []
  for (let n = 0; n < 5; n++) {
    const path = document.createElementNS(ns, "path")
    path.setAttribute("class", "traces__noise")
    path.setAttribute("d", line(26, 60 + n * 26))
    svg.appendChild(path)
    made.push(path)
  }

  /* The resolved read: one calm curve through the middle of the noise. */
  const signal = document.createElementNS(ns, "path")
  signal.setAttribute("class", "traces__signal")
  signal.setAttribute(
    "d",
    "M0 168 C 160 158, 240 128, 380 132 S 620 104, 730 78 S 900 52, 1000 44"
  )
  svg.appendChild(signal)
  signal.style.setProperty("--len", signal.getTotalLength().toFixed(1))

  return made
}

/* ----------------------------------------------------------------- mount -- */

/**
 * Wire the story. Returns a teardown that kills every trigger it created and
 * releases the clips — Gatsby keeps the app alive across client-side
 * navigation, so leaving these behind would leak on every route change.
 */
export function mountScrollStory() {
  if (document.documentElement.dataset.motion === "reduced") return () => {}

  gsap.registerPlugin(ScrollTrigger)

  const media = createMedia()
  const triggers = []
  const sections = [...document.querySelectorAll("[data-chapter]")]

  /* Lazy-load: attach a chapter's clip one viewport before it is needed. */
  const loader =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries, obs) => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return
              const v = entry.target.querySelector("[data-scrub]")
              if (v) media.attach(v)
              obs.unobserve(entry.target)
            })
          },
          { rootMargin: "100% 0px" }
        )
      : null

  sections.forEach(section => {
    const video = section.querySelector("[data-scrub]")
    if (video) {
      media.register(video)
      if (loader && !video.hasAttribute("data-eager")) loader.observe(section)
      else media.attach(video)
    }

    const make = handlers[section.dataset.chapter]
    const onProgress = make ? make(section) : null
    if (onProgress) onProgress(0)

    triggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: self => {
          if (video) media.setProgress(video, self.progress)
          if (onProgress) onProgress(self.progress)
        },
        onToggle: self => {
          if (video) media.setActive(video, self.isActive)
        },
      })
    )
  })

  /* iOS hands a video to the decoder only after a gesture. */
  const events = ["pointerdown", "touchstart", "wheel", "keydown"]
  events.forEach(type =>
    window.addEventListener(type, media.prime, { once: true, passive: true })
  )

  /* Fonts land after first paint and change the metrics the sticky stages
     were measured against. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }

  return () => {
    events.forEach(type => window.removeEventListener(type, media.prime))
    if (loader) loader.disconnect()
    triggers.forEach(t => t.kill())
    media.destroy()
  }
}
