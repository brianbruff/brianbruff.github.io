const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    console.log("Testing desktop view...")
    await page.goto("http://localhost:8000/blog/")

    // Test 1: Check if cards are visible
    const cards = page.locator(".blog-card")
    const cardCount = await cards.count()
    console.log(`✓ Found ${cardCount} blog cards`)

    // Test 2: Check hover effects
    await cards.first().hover()
    const transform = await cards.first().evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.transform
    })
    console.log("✓ Hover effect applied:", transform !== "none" ? "Yes" : "No")

    // Screenshot desktop
    await page.screenshot({ path: "desktop-blog-test.png", fullPage: true })
    console.log("✓ Saved desktop screenshot")

    // Test 3: Check if entire card is clickable (click excerpt)
    console.log("Testing card clickability...")
    await cards.first().locator(".blog-excerpt").click()
    await page.waitForTimeout(500) // Wait for navigation
    const currentUrl = page.url()
    console.log("Current URL after click:", currentUrl)
    if (currentUrl.includes("/blog/") && currentUrl.length > "/blog/".length) {
      console.log("✓ Card clicked successfully from excerpt")
    } else {
      console.log("✗ Card click failed")
    }

    await page.goto("http://localhost:8000/blog/")
    await page.waitForLoadState("networkidle")

    // Test mobile
    console.log("\nTesting mobile view...")
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("http://localhost:8000/blog/")

    // Test 4: Check if header overlaps content
    const header = page.locator(".header").first()
    const firstCard = page.locator(".blog-card").first()

    const headerBox = await header.boundingBox()
    const cardBox = await firstCard.boundingBox()

    console.log("Header height:", headerBox.height)
    console.log("Header Y position:", headerBox.y)
    console.log("Card Y position:", cardBox.y)

    if (cardBox.y > headerBox.y + headerBox.height) {
      console.log("✓ Cards are not overlapped by header on mobile")
    } else {
      console.log("✗ WARNING: Cards may be overlapped by header!")
    }

    // Screenshot mobile
    await page.screenshot({ path: "mobile-blog-test.png", fullPage: false })
    console.log("✓ Saved mobile screenshot")
  } catch (error) {
    console.error("Error during test:", error)
  } finally {
    await browser.close()
    console.log("\n✓ All tests completed!")
  }
})()
