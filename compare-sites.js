const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Take screenshot of homepage
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'homepage-with-effects.png', fullPage: true });
  console.log('Homepage screenshot saved as homepage-with-effects.png');

  // Hover over a card to capture the glow effect
  const firstCard = await page.locator('.service-card').first();
  await firstCard.hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'homepage-hover-effect.png', fullPage: true });
  console.log('Homepage with hover effect saved as homepage-hover-effect.png');

  // Take screenshot of resume page
  await page.goto('http://localhost:8000/resume');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'resume-with-gradient.png', fullPage: true });
  console.log('Resume page screenshot saved as resume-with-gradient.png');

  // Take screenshot of blog page
  await page.goto('http://localhost:8000/blog');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'blog-page.png', fullPage: true });
  console.log('Blog page screenshot saved as blog-page.png');

  await browser.close();
  console.log('\nAll screenshots captured successfully!');
  console.log('Check the following files:');
  console.log('- homepage-with-effects.png');
  console.log('- homepage-hover-effect.png');
  console.log('- resume-with-gradient.png');
  console.log('- blog-page.png');
})();