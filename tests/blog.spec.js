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
    await page
      .locator(".post-row")
      .first()
      .locator(".post-row__excerpt")
      .click()
    await expect(page).toHaveURL(/\/blog\/.+/)
    await expect(page.locator(".post__title")).toBeVisible()
  })

  test("hovering a row gives feedback", async ({ page }) => {
    const row = page.locator(".post-row").first()
    const before = await row.evaluate(
      el => getComputedStyle(el).backgroundColor
    )
    await row.hover()
    await expect
      .poll(() => row.evaluate(el => getComputedStyle(el).backgroundColor))
      .not.toBe(before)
  })

  /* The primary row is now a closed set of categories rather than every tag in
     the archive. The two things that mattered about it still do: each chip is
     a distinct shelf, and picking one actually cuts the list down. */
  test("the category chips are distinct, and picking one narrows the list", async ({
    page,
  }) => {
    const labels = await page.locator(".tag").allInnerTexts()
    expect(new Set(labels).size).toBe(labels.length)

    const total = await page.locator(".post-row").count()
    await page.locator(".tag").nth(1).click()
    await expect(page.locator(".tag").nth(1)).toHaveClass(/is-active/)
    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeLessThan(total)
  })

  /* Search is the widest net on the page and the only handle on the years of
     posts that carry no tags at all. Typing has to cut the list down, and
     letting go of the query has to hand back the whole archive — a filter you
     cannot undo is a trap. */
  test("searching narrows the list, and clearing it restores the archive", async ({
    page,
  }) => {
    const total = await page.locator(".post-row").count()

    await page.locator(".search__input").fill("silverlight")
    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeLessThan(total)
    expect(await page.locator(".post-row").count()).toBeGreaterThan(0)

    await page.locator(".search__clear").click()
    await expect.poll(() => page.locator(".post-row").count()).toBe(total)
  })

  /* A query that matches nothing must say so and offer the way back, rather
     than leaving the reader staring at a blank stretch of page wondering
     whether the index broke. */
  test("a search that matches nothing shows the empty state", async ({
    page,
  }) => {
    await page.locator(".search__input").fill("qwertyuiopnotathing")
    await expect.poll(() => page.locator(".post-row").count()).toBe(0)
    await expect(page.locator(".posts__empty")).toBeVisible()

    await page.locator(".posts__empty-reset").click()
    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeGreaterThan(10)
  })

  /* The query string is the whole of this page's state, which is what makes a
     filtered view shareable. So the round trip has to hold: what the chip
     writes into the URL is what that URL reproduces when opened cold. */
  test("a category goes into the URL, and that URL reproduces the view", async ({
    page,
  }) => {
    const chip = page.locator(".tag").nth(1)
    const label = await chip.textContent()
    await chip.click()

    await expect(page).toHaveURL(/\/blog\/\?category=[a-z0-9-]+$/)
    const shared = page.url()
    const count = await page.locator(".post-row").count()

    await page.goto(shared)
    await expect(page.locator(".tag.is-active")).toHaveText(label)
    await expect.poll(() => page.locator(".post-row").count()).toBe(count)
  })

  /* The tags under a row sit outside the row's link on purpose. Clicking one
     is a refinement of the list you are looking at, not a way into the post —
     if it navigates, the tags have been swallowed by the link again. */
  test("clicking a tag on a row filters instead of opening the post", async ({
    page,
  }) => {
    const total = await page.locator(".post-row").count()
    const tag = page.locator(".post-row__tag").first()
    const label = (await tag.innerText()).trim()
    await tag.click()

    await expect(page).toHaveURL(/\/blog\/\?tag=/)
    await expect(page.locator(".post__title")).toHaveCount(0)
    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeLessThan(total)
    await expect
      .poll(() => page.locator(".post-row__tag.is-active").count())
      .toBeGreaterThan(0)
    expect(label.length).toBeGreaterThan(0)
  })

  /* Two thirds of the archive predates 2013, so the era chips exist to let a
     reader leave that behind in one click. The test of that is the dates on
     the rows, not the count beside the chip. */
  test("the era filter narrows to its own decade", async ({ page }) => {
    const chip = page.locator(".chip", { hasText: "2020" }).first()
    await chip.click()
    await expect(chip).toHaveClass(/is-active/)

    await expect
      .poll(() => page.locator(".post-row").count())
      .toBeGreaterThan(0)
    const years = await page
      .locator(".post-row__date")
      .evaluateAll(nodes =>
        nodes.map(n => Number(n.textContent.trim().slice(-4)))
      )
    expect(years.length).toBeGreaterThan(0)
    expect(Math.min(...years)).toBeGreaterThanOrEqual(2020)
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

    /* The quiet case above measures a page with the filters at rest. Every
       control that only appears once you start filtering — the clear button,
       the tag refinement row, the summary line naming what is on — is another
       chance to push a phone sideways, so the loud case is measured too. */
    test("the page still never scrolls sideways with every control on", async ({
      page,
    }) => {
      await page.locator(".search__input").fill("silverlight")
      await page.locator(".tag").nth(1).click()
      await page.locator(".chip").first().click()
      await expect(page.locator(".filters__summary")).toBeVisible()
      await expect(page.locator(".chips")).toHaveCount(2)

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
