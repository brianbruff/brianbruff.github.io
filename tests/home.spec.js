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
})
