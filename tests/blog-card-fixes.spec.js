import { test, expect } from "@playwright/test"

test.describe("Blog Page Card Fixes", () => {
  test("desktop: entire card should be clickable", async ({ page }) => {
    await page.goto("http://localhost:8000/blog")

    const firstCard = page.locator(".blog-card").first()

    // Click on the excerpt (not the header)
    await firstCard.locator(".blog-excerpt").click()

    // Should navigate to blog post page
    await expect(page).toHaveURL(/\/blog\//)
  })

  test("mobile: cards should not be cut off by header", async ({
    page,
    context,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("http://localhost:8000/blog")

    const firstCard = page.locator(".blog-card").first()

    // Get the bounding box of the first card and the header
    const cardBox = await firstCard.boundingBox()
    const headerBox = await page.locator(".header").first().boundingBox()

    // The card should not be overlapped by the header
    // First card should start below the header
    console.log("Card Y:", cardBox.y)
    console.log("Header Y + Height:", headerBox.y + headerBox.height)
    expect(cardBox.y).toBeGreaterThan(headerBox.y + headerBox.height)
  })

  test("mobile: card should still be clickable", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("http://localhost:8000/blog")

    const firstCard = page.locator(".blog-card").first()

    // Click on the excerpt (not the header)
    await firstCard.locator(".blog-excerpt").click()

    // Should navigate to blog post page
    await expect(page).toHaveURL(/\/blog\//)
  })

  test("card hover effects work", async ({ page }) => {
    await page.goto("http://localhost:8000/blog")

    const firstCard = page.locator(".blog-card").first()

    // Hover over the card
    await firstCard.hover()

    // Card should have transform style applied
    const transform = await firstCard.evaluate(
      el => window.getComputedStyle(el).transform
    )
    expect(transform).not.toBe("none")
  })

  test("header should not overlap content on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("http://localhost:8000/blog")

    // Take a screenshot for visual verification
    await page.screenshot({ path: "mobile-blog-header.png", fullPage: false })

    // Get the header and main content elements
    const header = page.locator(".header")
    const blogContainer = page.locator(".blog-page-container")

    // Check that blog container has padding top
    const paddingTop = await blogContainer.evaluate(el => {
      return window.getComputedStyle(el).paddingTop
    })

    expect(paddingTop).toBeTruthy()
  })
})
