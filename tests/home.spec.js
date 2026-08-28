import { test, expect } from "@playwright/test"

/** The scroll story: pinned chapters whose video time follows the scroll. */
test.describe("Homepage scroll story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important }" })
  })

  test("mounts all five chapters", async ({ page }) => {
    await expect(page.locator("[data-chapter]")).toHaveCount(5)
    await expect(page.locator(".hero__title")).toBeVisible()
  })

  test("scrolling advances the hero clip and rewinds on the way back", async ({
    page,
  }) => {
    const time = () => page.locator("#hero video").evaluate(v => v.currentTime)

    await expect.poll(() => page.locator("#hero video").evaluate(v => v.readyState))
      .toBeGreaterThan(1)

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2))
    await expect.poll(time, { timeout: 8000 }).toBeGreaterThan(1)

    const advanced = await time()
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(time, { timeout: 8000 }).toBeLessThan(advanced)
  })

  test("the tagline follows scroll position", async ({ page }) => {
    const active = () => page.locator(".hero__tagline.is-active").innerText()
    const first = await active()
    await page.evaluate(() => {
      const hero = document.getElementById("hero")
      window.scrollTo(0, (hero.offsetHeight - window.innerHeight) * 0.8)
    })
    await expect.poll(active, { timeout: 8000 }).not.toBe(first)
  })

  test("the topology lights up as the chapter plays", async ({ page }) => {
    await page.evaluate(() => {
      const work = document.getElementById("work")
      window.scrollTo(0, work.offsetTop + (work.offsetHeight - window.innerHeight) * 0.9)
    })
    await expect
      .poll(() => page.locator(".topology__group.is-live").count(), { timeout: 8000 })
      .toBe(5)
  })

  /* The clips are 16:9. On an ultrawide the stage is far wider than that, so
     `cover` fills to the width and throws the surplus height away — centred,
     half of it off the top, which took the top of the head clean off on a 34"
     panel. The heads sit 50px and 48px down their 900px frames, so the test is
     simply that the crop stays inside that: measured in source pixels, not in
     appearance, because that is the number the framing actually turns on. */
  test.describe("ultrawide", () => {
    const HEAD_TOP = { hero: 50, journey: 48 }

    for (const [w, h, label] of [
      [3440, 1206, "34in panel, real window height"],
      [3440, 1440, "34in panel, full height"],
      [3840, 1080, "32:9"],
    ]) {
      test(`keeps the heads out of the crop at ${w}x${h} (${label})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: w, height: h })
        await page.goto("/")

        for (const [id, headTop] of Object.entries(HEAD_TOP)) {
          const cropped = await page
            .locator(`#${id} .stage__poster`)
            .evaluate(img => {
              const box = img.getBoundingClientRect()
              const scale = box.width / img.naturalWidth
              const overflow = img.naturalHeight * scale - box.height
              const bias =
                parseFloat(
                  getComputedStyle(img).objectPosition.split(" ")[1]
                ) / 100
              return (overflow * bias) / scale
            })

          expect(cropped, `${id}: crop must stay above the head`).toBeLessThan(
            headTop
          )
        }
      })
    }

    /* The work clip has no headroom in the source at all, so the only correct
       crop there is none: anything taken off the top is head. */
    test("anchors the work clip, which has no headroom to give", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 3440, height: 1206 })
      await page.goto("/")
      await expect(page.locator("#work .stage__poster")).toHaveCSS(
        "object-position",
        "50% 0%"
      )
    })

    /* The subject of the work clip stands in the right third of his frame,
       and the topology panel grows with the column it sits in. Left uncapped
       that column reaches ~1500px on a 34" panel and the panel covered 94%
       of him. Overlap is the assertion — the panel is meant to sit beside
       the man, not on him. */
    for (const [w, h] of [
      [3440, 1440],
      [3440, 1206],
      [3840, 1080],
    ]) {
      test(`the topology panel keeps clear of the subject at ${w}x${h}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: w, height: h })
        await page.goto("/")
        await page.locator("#work").waitFor()

        const top = await page.evaluate(
          () => document.querySelector("#work").offsetTop
        )
        for (let y = 0; y < top + 400; y += 500) {
          await page.evaluate(v => scrollTo(0, v), y)
        }
        await page.evaluate(v => scrollTo(0, v), top + 400)

        const { panelRight, subjectLeft } = await page.evaluate(() => {
          const img = document.querySelector("#work .stage__poster")
          const scale = img.getBoundingClientRect().width / img.naturalWidth
          return {
            panelRight: document.querySelector(".topology").getBoundingClientRect()
              .right,
            /* Where he starts in the 1600px-wide source frame. */
            subjectLeft: 1050 * scale,
          }
        })

        expect(panelRight).toBeLessThanOrEqual(subjectLeft)
      })
    }

    /* The cap is only meant to bite once there is width to spare. At 1920 the
       overlay already spans the viewport, so it must still do so — that is
       what says the screens that were fine did not move. */
    test("the work overlay is uncapped at 1920, and capped beyond it", async ({
      page,
    }) => {
      const width = async () => {
        await page.locator(".work__overlay").waitFor()
        return page
          .locator(".work__overlay")
          .evaluate(el => el.getBoundingClientRect().width)
      }

      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto("/")
      expect(await width()).toBe(1920)

      await page.setViewportSize({ width: 3440, height: 1206 })
      await page.goto("/")
      expect(await width()).toBeLessThan(3440)
    })

    /* The bias is a share of the surplus, so at 16:9 — where the clip and the
       stage are the same shape and there is no surplus — it must come to
       nothing. Asserted as the crop rather than the CSS value on purpose: the
       declaration does apply at 16:9, it just has nothing to act on, and it is
       the crop that decides whether narrower screens moved. */
    test("crops nothing at 16:9, where there is no surplus", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto("/")

      const cropped = await page
        .locator("#hero .stage__poster")
        .evaluate(img => {
          const box = img.getBoundingClientRect()
          const scale = box.width / img.naturalWidth
          const overflow = img.naturalHeight * scale - box.height
          const bias =
            parseFloat(getComputedStyle(img).objectPosition.split(" ")[1]) / 100
          return (Math.max(0, overflow) * bias) / scale
        })

      expect(cropped).toBeLessThan(1)
    })
  })

  test("no page-level horizontal scroll", async ({ page }) => {
    const { scrollWidth, clientWidth } = await page.evaluate(() => {
      const d = document.documentElement
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth }
    })
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test.describe("reduced motion", () => {
    /* emulateMedia rather than the reducedMotion context option: the context
       option does not reach matchMedia in this setup, which silently made the
       assertions below run against the animated page. */
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto("/")
    })

    test("renders every chapter as a readable static document", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced")

      // Nothing is left hidden behind a scrub that never runs.
      for (const item of await page.locator(".journey__item").all()) {
        await expect(item).toBeVisible()
      }
      await expect(page.locator(".features__item").first()).toBeVisible()
      await expect(page.locator(".phrases__item").first()).toBeVisible()

      // Chapters collapse to their natural height instead of pinning.
      const pinned = await page.evaluate(() =>
        [...document.querySelectorAll(".stage")].some(
          s => getComputedStyle(s).position === "sticky"
        )
      )
      expect(pinned).toBe(false)
    })
  })

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test("uses the small encodes and traps no chapter", async ({ page }) => {
      await expect
        .poll(() => page.locator("#hero video").evaluate(v => v.currentSrc))
        .toContain(".mobile.mp4")

      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll(".stage__overlay")].some(
          el => el.scrollHeight > el.clientHeight + 1
        )
      )
      expect(clipped).toBe(false)
    })
  })

  /* The multi-agent chapter ran off the right edge of every phone. Its copy
     column collapses to a single `1fr` track below 980px, and `1fr` carries an
     automatic minimum, so the track could not shrink below the widest thing in
     it: the callout, which asks for `width: max-content` (~422px) and leans on
     `max-width: 100%` to rein itself in. Percentage max-widths are ignored
     while a track is being sized from its contents, so the track took the full
     422px, the heading and lead stretched to match, and `.stage`'s overflow
     clip cut the ends off. Nothing scrolled — the text was simply gone, which
     is why the page-level scroll check above never saw it.

     So the assertion is on the content box, not on document scrollWidth. */
  test.describe("the multi-agent chapter fits a phone", () => {
    for (const [w, h, label] of [
      [390, 844, "iPhone 14"],
      [412, 915, "Galaxy S24 Ultra"],
      [360, 780, "narrowest in common use"],
    ]) {
      test(`keeps its copy inside the viewport at ${w}x${h} (${label})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: w, height: h })
        await page.goto("/")
        await page.locator(".work__overlay").waitFor()

        const spills = await page.evaluate(() => {
          const overlay = document.querySelector(".work__overlay")
          const style = getComputedStyle(overlay)
          const limit =
            overlay.getBoundingClientRect().right - parseFloat(style.paddingRight)
          return [...overlay.querySelectorAll("*")]
            .filter(el => el.getBoundingClientRect().right > limit + 1)
            .map(el => `${el.className.baseVal ?? el.className}`)
        })
        expect(spills).toEqual([])
      })
    }
  })
})

/**
 * The header used to carry one set of links on the homepage and a different
 * set everywhere else: no Home and no Résumé while you were on the story, no
 * chapters once you left it. Moving between pages rearranged the menu under
 * you. The core three are now fixed in place; the homepage appends its
 * chapters to them rather than replacing them.
 */
test.describe("Site navigation", () => {
  const CORE = ["Home", "Writing", "Résumé"]
  const A_POST = "/blog/2011-03-05-dynamically-load-html-into-a-div-using-jquery/"

  /* Wait for the header to exist before reading it: these navigations land on
     a fresh document each time, and an empty list is hydration, not a menu. */
  const links = async page => {
    await page.locator(".header__link").first().waitFor()
    return page
      .locator(".header__link")
      .evaluateAll(as => as.map(a => a.textContent.trim()))
  }

  for (const path of ["/", "/blog/", "/resume/", A_POST]) {
    test(`the same three links lead the header on ${path}`, async ({ page }) => {
      await page.goto(path)
      expect((await links(page)).slice(0, 3)).toEqual(CORE)
    })
  }

  /* Chapters are in-page anchors: they mean something on the story and
     nothing anywhere else, which is why they do not travel. */
  test("the homepage adds its chapters after the core, and only there", async ({
    page,
  }) => {
    await page.goto("/")
    expect(await links(page)).toEqual([
      ...CORE,
      "Journey",
      "Work",
      "Open source",
      "Analyst",
    ])

    await page.goto("/blog/")
    expect(await links(page)).toEqual(CORE)
  })

  /* Every chapter below the hero needs a way in from the header. Commodity
     was the one that did not have one, so the newest piece of work was also
     the hardest to reach. The hero is excluded because Home already goes
     there — so the count is the rail's chapters, less that one. */
  test("every chapter below the hero is reachable from the header", async ({
    page,
  }) => {
    await page.goto("/")
    const targets = await page
      .locator(".header__item--chapter .header__link")
      .evaluateAll(as => as.map(a => a.getAttribute("href")))

    const railTargets = await page
      .locator(".rail__tick")
      .evaluateAll(as => as.map(a => a.getAttribute("href")))

    expect(targets).toEqual(railTargets.filter(href => href !== "#hero"))

    for (const href of targets) {
      await expect(page.locator(href)).toHaveCount(1)
    }
  })

  /* Whichever page you are on should be the one lit in the menu — including
     a post, which lives under Writing rather than at it. */
  test("the menu says which page you are on", async ({ page }) => {
    for (const [path, current] of [
      ["/", "Home"],
      ["/blog/", "Writing"],
      ["/resume/", "Résumé"],
      [A_POST, "Writing"],
    ]) {
      await page.goto(path)
      await expect(page.locator(".header__link.is-current")).toHaveText(current)
    }
  })
})
