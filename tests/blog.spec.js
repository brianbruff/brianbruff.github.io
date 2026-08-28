import { test, expect } from "@playwright/test"

/**
 * The archive index. The old design used cards; the intents carried over —
 * rows are visible, the whole row is a target, nothing hides under the fixed
 * header on mobile, and hover gives feedback.
 */
test.describe("Writing index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/")
  })

  test("lists posts", async ({ page }) => {
    await expect(page.locator(".post-row").first()).toBeVisible()
    expect(await page.locator(".post-row").count()).toBeGreaterThan(10)
  })

  test("the whole row is clickable, not just the title", async ({ page }) => {
    await page.locator(".post-row").first().locator(".post-row__excerpt").click()
    await expect(page).toHaveURL(/\/blog\/.+/)
    await expect(page.locator(".post__title")).toBeVisible()
  })

  test("hovering a row gives feedback", async ({ page }) => {
    const row = page.locator(".post-row").first()
    const before = await row.evaluate(el => getComputedStyle(el).backgroundColor)
    await row.hover()
    await expect
      .poll(() => row.evaluate(el => getComputedStyle(el).backgroundColor))
      .not.toBe(before)
  })

  test("tag filter narrows the list and folds case variants", async ({ page }) => {
    const labels = await page.locator(".tag").allInnerTexts()
    expect(new Set(labels).size).toBe(labels.length)

    const total = await page.locator(".post-row").count()
    await page.locator(".tag").nth(1).click()
    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeLessThan(total)
  })

  test.describe("mobile", () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test("the first row clears the fixed header", async ({ page }) => {
      const row = page.locator(".post-row").first()
      await expect(row).toBeVisible()
      const rowBox = await row.boundingBox()
      const headerBox = await page.locator(".header").boundingBox()
      expect(rowBox.y).toBeGreaterThan(headerBox.y + headerBox.height)
    })

    test("the page never scrolls sideways", async ({ page }) => {
      const { scrollWidth, clientWidth } = await page.evaluate(() => {
        const d = document.documentElement
        return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth }
      })
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test("navigation is reachable without the rail", async ({ page }) => {
      await expect(page.locator(".header__nav")).toBeVisible()
      await page.getByRole("link", { name: "Résumé" }).first().click()
      await expect(page).toHaveURL(/\/resume\//)
    })
  })
})
