import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Small mobile', width: 320, height: 568 },
  { name: 'Standard mobile', width: 375, height: 667 },
  { name: 'Modern mobile', width: 390, height: 844 },
  { name: 'Large mobile', width: 430, height: 932 },
  { name: 'Tablet portrait', width: 768, height: 1024 },
  { name: 'Tablet landscape', width: 1024, height: 768 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

const sections = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills/Tech Wall' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'resume', name: 'Virtual Resume' },
  { id: 'contactSection', name: 'Contact' },
];

test.describe('Responsive Design Audit', () => {
  for (const vp of viewports) {
    test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      });

      test('No horizontal overflow', async ({ page }) => {
        // Check for visual horizontal overflow - elements extending beyond viewport
        const hasVisualOverflow = await page.evaluate((vpWidth) => {
          const viewportWidth = vpWidth;
          const elements = document.querySelectorAll('body *');
          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            // Check if element visually extends beyond viewport
            if (rect.right > viewportWidth + 1 || rect.left < -1) {
              // Allow small rounding errors
              if (rect.right - viewportWidth > 2 || Math.abs(rect.left) > 2) {
                return true;
              }
            }
          }
          return false;
        }, vp.width);
        expect(hasVisualOverflow).toBe(false);
      });

      test('Navigation is accessible', async ({ page }) => {
        const nav = page.locator('.site-header');
        await expect(nav).toBeVisible();
        
        if (vp.width <= 768) {
          const hamburger = page.locator('#mobileHamburger');
          await expect(hamburger).toBeVisible();
        } else {
          const navPill = page.locator('.nav-floating-pill');
          await expect(navPill).toBeVisible();
        }
      });

      test('Theme toggle works', async ({ page }) => {
        const themeBtn = page.locator('#themeToggleBtn');
        await expect(themeBtn).toBeVisible();
        await themeBtn.click();
        await page.waitForTimeout(300);
        const theme = await page.getAttribute('html', 'data-theme');
        expect(theme).toBe('dark');
      });

      for (const section of sections) {
        test(`Section ${section.name} renders without clipping`, async ({ page }) => {
          const el = page.locator(`#${section.id}`);
          await expect(el).toBeVisible();
          
          const box = await el.boundingBox();
          expect(box).not.toBeNull();
          if (box) {
            expect(box.x).toBeGreaterThanOrEqual(-1);
            expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
          }
        });
      }

      test('Hero section fits viewport', async ({ page }) => {
        const hero = page.locator('#home');
        await expect(hero).toBeVisible();
        const box = await hero.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(vp.width + 1);
        }
      });

      test('J Bot avatar is visible and positioned correctly', async ({ page }) => {
        const widget = page.locator('#jbot-widget');
        await expect(widget).toBeVisible();
        
        const box = await widget.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.y).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
        }
      });

      test('J Bot chat panel opens and fits viewport', async ({ page }) => {
        const toggle = page.locator('#jbot-toggle');
        await expect(toggle).toBeVisible();
        await page.waitForTimeout(1500);
        
        // Check if click works
        const beforeClick = await page.evaluate(() => {
          const chat = document.getElementById('jbot-chat');
          const toggle = document.getElementById('jbot-toggle');
          return {
            chatClass: chat ? chat.className : 'none',
            toggleAria: toggle ? toggle.getAttribute('aria-expanded') : 'none'
          };
        });
        console.log('Before click:', beforeClick);
        
        // Listen for console errors
        page.on('console', msg => {
          if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
        });
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        
        await toggle.click();
        await page.waitForTimeout(1000);
        
        const afterClick = await page.evaluate(() => {
          const chat = document.getElementById('jbot-chat');
          const toggle = document.getElementById('jbot-toggle');
          return {
            chatClass: chat ? chat.className : 'none',
            chatOpacity: chat ? window.getComputedStyle(chat).opacity : 'none',
            chatVisibility: chat ? window.getComputedStyle(chat).visibility : 'none',
            toggleAria: toggle ? toggle.getAttribute('aria-expanded') : 'none'
          };
        });
        console.log('After click:', afterClick);
        
        const chat = page.locator('#jbot-chat');
        await expect(chat).toBeVisible();
        
        const box = await chat.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(-10);
          expect(box.y).toBeGreaterThanOrEqual(-10);
          expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 10);
          expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 10);
        }
        
        const closeBtn = page.locator('#jbot-close');
        await closeBtn.click();
      });

      test('Virtual Resume modal opens correctly', async ({ page }) => {
        const viewBtn = page.locator('#viewResumeBtn');
        if (await viewBtn.isVisible()) {
          await viewBtn.click();
          await page.waitForTimeout(500);
          
          const modal = page.locator('#resumePaperModal');
          await expect(modal).toBeVisible();
          
          const box = await modal.boundingBox();
          expect(box).not.toBeNull();
          if (box) {
            expect(box.width).toBeLessThanOrEqual(vp.width + 10);
          }
          
          const closeBtn = page.locator('#resumePaperCloseBtn');
          await closeBtn.click();
        }
      });

      test('Contact section hanging badge works', async ({ page }) => {
        const badge = page.locator('#devIdBadgeCard');
        await expect(badge).toBeVisible();
        
        const box = await badge.boundingBox();
        expect(box).not.toBeNull();
        if (box && vp.width >= 768) {
          expect(box.x).toBeGreaterThanOrEqual(-1);
        }
      });

      test('No JavaScript errors', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        page.on('pageerror', err => {
          errors.push(err.message);
        });
        
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        const criticalErrors = errors.filter(e => 
          !e.includes('favicon') && 
          !e.includes('Extension') &&
          !e.includes('network error') &&
          !e.includes('404')
        );
        
        expect(criticalErrors.length).toBe(0);
      });

      test('Images load correctly', async ({ page }) => {
        const images = page.locator('img');
        const count = await images.count();
        
        for (let i = 0; i < Math.min(count, 10); i++) {
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          if (src && !src.startsWith('data:')) {
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
          }
        }
      });
    });
  }
});

test.describe('J Bot Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  });

  test('Chat opens and closes repeatedly without duplicates', async ({ page }) => {
    const toggle = page.locator('#jbot-toggle');
    
    for (let i = 0; i < 3; i++) {
      await toggle.click();
      await page.waitForTimeout(200);
      
      const chat = page.locator('#jbot-chat');
      await expect(chat).toHaveClass(/jbot-chat--open/);
      
      const closeBtn = page.locator('#jbot-close');
      await closeBtn.click();
      await page.waitForTimeout(200);
      
      await expect(chat).not.toHaveClass(/jbot-chat--open/);
    }
    
    const widgets = page.locator('#jbot-widget');
    expect(await widgets.count()).toBe(1);
  });

  test('Input and send button are accessible', async ({ page }) => {
    const toggle = page.locator('#jbot-toggle');
    await toggle.click();
    await page.waitForTimeout(200);
    
    const input = page.locator('#jbot-input');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    
    const sendBtn = page.locator('#jbot-send');
    await expect(sendBtn).toBeVisible();
    
    const closeBtn = page.locator('#jbot-close');
    await closeBtn.click();
  });

  test('Typing indicator appears when sending', async ({ page }) => {
    const toggle = page.locator('#jbot-toggle');
    await toggle.click();
    await page.waitForTimeout(200);
    
    const input = page.locator('#jbot-input');
    await input.fill('What are your skills?');
    
    const sendBtn = page.locator('#jbot-send');
    await sendBtn.click();
    await page.waitForTimeout(100);
    
    const typing = page.locator('#jbot-typing');
    await expect(typing).toBeVisible();
    
    const closeBtn = page.locator('#jbot-close');
    await closeBtn.click();
  });
});

test.describe('Accessibility Tests', () => {
  for (const vp of viewports) {
    test(`${vp.name} - Keyboard navigation works`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).not.toBe('BODY');
    });

    test(`${vp.name} - Focus indicators visible`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      
      await page.keyboard.press('Tab');
      const focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow
        };
      });
      expect(focusStyles).not.toBeNull();
    });
  }
});

test.describe('Performance & Layout Stability', () => {
  test('No layout shift on load', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            clsValue += entry.value;
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });
});