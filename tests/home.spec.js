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
