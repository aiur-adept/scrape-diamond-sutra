const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapePage(browser, pageNumber) {
  const url = `https://diamond-sutra.com/read-the-diamond-sutra-here/diamond-sutra-chapter-${pageNumber}/`;
  const page = await browser.newPage();
  await page.goto(url);
  const content = await page.$$eval('.entry-content > p:not(:nth-last-child(-n+2))', (paragraphs) => {
    return paragraphs.map((p) => p.textContent.trim());
  });
  await page.close();
  return content;
}

async function scrapeAllPages() {
  const browser = await puppeteer.launch();
  const totalChapters = 32;
  let allContent = [];

  for (let i = 1; i <= totalChapters; i++) {
    const pageContent = await scrapePage(browser, i);
    allContent = allContent.concat(pageContent);
  }

  await browser.close();

  return allContent
}

async function main() {
  console.log('scraping diamond sutra...');
  const diamondSutra = await scrapeAllPages();
  try {
    await fs.writeFile('diamond_sutra.txt', diamondSutra.join('\n'));
    console.log('Content written to diamond_sutra.txt');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

main();

