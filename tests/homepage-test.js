const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    console.log("Testing homepage cards...")
    await page.goto("http://localhost:8000/")

    // Test 1: Check if cards are visible
    const cards = page.locator(".bento-card")
    const cardCount = await cards.count()
    console.log(`✓ Found ${cardCount} bento cards`)

    // Test 2: Check title color is orange
    const firstTitle = cards.first().locator(".card-title")
    const titleColor = await firstTitle.evaluate(el => {
      return window.getComputedStyle(el).color
    })
    console.log("Card title color:", titleColor)
    if (
      titleColor.includes("249, 115, 22") ||
      titleColor.includes("rgb(249, 115, 22)")
    ) {
      console.log("✓ Card title is orange by default")
    } else {
      console.log("✗ Card title color issue")
    }

    // Test 3: Check hover effect
    await cards.first().hover()
    const hoveredTitleColor = await firstTitle.evaluate(el => {
      return window.getComputedStyle(el).color
    })
    console.log("Hovered card title color:", hoveredTitleColor)
    if (
      hoveredTitleColor.includes("251, 146, 60") ||
      hoveredTitleColor.includes("rgb(251, 146, 60)")
    ) {
      console.log("✓ Card title changes to lighter orange on hover")
    } else {
      console.log("✗ Card hover color issue")
    }

    // Test 4: Click entire card (not just the link)
    console.log("\nTesting card clickability...")
    await cards.first().locator(".card-description").click()
    await page.waitForTimeout(500)
    const currentUrl = page.url()
    console.log("Current URL after clicking card:", currentUrl)
    if (currentUrl === "http://localhost:8000/blog/") {
      console.log("✓ Entire card is clickable!")
    } else {
      console.log("✗ Card click failed")
    }

    // Screenshot homepage
    await page.screenshot({ path: "/tmp/homepage-test.png", fullPage: true })
    console.log("\n✓ Saved homepage screenshot")
  } catch (error) {
    console.error("Error during test:", error)
  } finally {
    await browser.close()
    console.log("\n✓ Homepage tests completed!")
  }
})()
