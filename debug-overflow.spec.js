import { test } from '@playwright/test';

test('Debug horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const overflowElements = await page.evaluate(() => {
    const results = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while (node = walker.nextNode()) {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        results.push({
          tag: node.tagName,
          id: node.id,
          class: node.className,
          rect: { left: rect.left, right: rect.right, width: rect.width },
          overflow: style.overflow,
          overflowX: style.overflowX
        });
      }
    }
    return results;
  });
  
  console.log('Overflow elements:', JSON.stringify(overflowElements, null, 2));
  
  // Also check body scrollWidth vs clientWidth
  const dims = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
    innerWidth: window.innerWidth
  }));
  console.log('Dimensions:', dims);
});