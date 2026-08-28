import { test, expect } from "@playwright/test"

/** The résumé portrait: a still that greets once, when motion is allowed. */
test.describe("Résumé portrait greeting", () => {
  const still = ".resume__portrait-still"
  const clip = ".resume__portrait-clip"

  test("the still carries the portrait on its own", async ({ page }) => {
    await page.goto("/resume/")

    await expect(page.locator(still)).toBeVisible()
    await expect(page.locator(still)).toHaveAttribute("alt", "Brian Keating")

    /* The plate reserves its box from the markup, so the masthead does not
       reflow when the picture arrives. */
    await expect(page.locator(still)).toHaveAttribute("width", "620")
    await expect(page.locator(still)).toHaveAttribute("height", "846")
  })

  test("the greeting plays once and stops on its final frame", async ({
    page,
  }) => {
    await page.goto("/resume/")

    await expect(page.locator("html")).toHaveAttribute("data-motion", "full")

    const video = page.locator(clip)
    /* The source is attached by script, not markup — nothing is fetched for a
       visitor who never gets the greeting. */
    await expect
      .poll(() => video.evaluate(v => v.currentSrc), { timeout: 10000 })
      .toContain("greeting")

    await expect
      .poll(() => video.evaluate(v => v.ended), { timeout: 15000 })
      .toBe(true)

    /* Stopped, not looping. */
    expect(await video.evaluate(v => v.loop)).toBe(false)
    expect(await video.evaluate(v => v.paused)).toBe(true)
  })

  test("it stays silent and inert to assistive tech", async ({ page }) => {
    await page.goto("/resume/")
    const video = page.locator(clip)

    expect(await video.evaluate(v => v.muted)).toBe(true)
    await expect(video).toHaveAttribute("aria-hidden", "true")
    /* The still already carries the alt text; two portraits in the tree would
       announce the man twice. */
    await expect(page.locator(`${clip}[alt]`)).toHaveCount(0)
  })

  test("it greets again on every load of the page", async ({ page }) => {
    await page.goto("/resume/")
    await expect
      .poll(() => page.locator(clip).evaluate(v => v.ended), { timeout: 15000 })
      .toBe(true)

    /* Away and back: the greeting is per page load, so it runs again rather
       than remembering that this visitor has already had one. */
    await page.goto("/blog/")
    await page.goto("/resume/")

    await expect
      .poll(() => page.locator(clip).evaluate(v => v.ended), { timeout: 15000 })
      .toBe(true)

    /* And a plain reload gets one too. */
    await page.reload()
    await expect
      .poll(() => page.locator(clip).evaluate(v => v.currentSrc), {
        timeout: 10000,
      })
      .toContain("greeting")
  })

  test.describe("reduced motion", () => {
    /* emulateMedia rather than the reducedMotion context option — same reason
       as the homepage suite: the context option does not reach matchMedia. */
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto("/resume/")
    })

    test("shows the portrait and never mounts the clip", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute(
        "data-motion",
        "reduced"
      )

      await expect(page.locator(still)).toBeVisible()
      await expect(page.locator(clip)).toBeHidden()

      /* Nothing was fetched for a greeting that will not run. */
      await page.waitForTimeout(1200)
      expect(await page.locator(clip).evaluate(v => v.currentSrc)).toBe("")
    })
  })
})
