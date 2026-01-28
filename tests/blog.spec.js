import { test, expect } from "@playwright/test"

test.describe("Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8000/blog")
  })

  test("should display blog cards", async ({ page }) => {
    const blogCards = page.locator(".blog-card")
    await expect(blogCards.first()).toBeVisible()
  })

  test("entire card should be clickable", async ({ page }) => {
    const firstCard = page.locator(".blog-card").first()

    // Click on the excerpt (not the header)
    await firstCard.locator(".blog-excerpt").click()

    // Should navigate to blog post page
    await expect(page).toHaveURL(/\/blog\//)
  })

  test("mobile view - cards should not be cut off by header", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    const firstCard = page.locator(".blog-card").first()

    // Get the bounding box of the first card and the header
    const cardBox = await firstCard.boundingBox()
    const headerBox = await page.locator(".header").first().boundingBox()

    // The card should not be overlapped by the header
    // First card should start below the header
    expect(cardBox.y).toBeGreaterThan(headerBox.y + headerBox.height)
  })

  test("card hover effects work", async ({ page }) => {
    const firstCard = page.locator(".blog-card").first()

    // Hover over the card
    await firstCard.hover()

    // Card should have transform style applied
    const transform = await firstCard.evaluate(
      el => window.getComputedStyle(el).transform
    )
    expect(transform).not.toBe("none")
  })
})
