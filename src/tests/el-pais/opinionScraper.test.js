const { setupBrowser, teardownBrowser } = require("../utils/browserHelpers");
const { scrapeArticles } = require("../../services/scrapingService");
const { translateTitles } = require("../../services/translationService");
const { analyzeHeaders } = require("../../services/analysisService");
const config = require("../../configs/appConfig");
const { BrowserStackSdk } = require("browserstack-node-sdk");

(async function opinionScraperTest() {
  let driver;

  let isPhone = false;

  try {
    console.log("Starting El País Opinion Scraper Test...");

    // Setup browser
    if (config.runOnBrowserStack) {
      console.log("Running on BrowserStack...");

      const currentPlatform = BrowserStackSdk.getCurrentPlatform();

      isPhone = currentPlatform.os === undefined ? true : false;

      config.browserstackBrowsers.map(async (browserConfig) => {
        driver = await setupBrowser(browserConfig, isPhone);
        try {
          await executeScraper(driver, isPhone);
        } finally {
          await teardownBrowser(driver);

          console.log("El País Opinion Scraper - BrowserStack test completed.");
        }
      });
    } else {
      console.log("Running on local machine...");

      driver = await setupBrowser(config.localBrowser, isPhone);
      try {
        await executeScraper(driver);
      } finally {
        await teardownBrowser(driver);

        console.log("El País Opinion Scraper - Local test completed.");
      }
    }

    async function executeScraper(driver, isPhone) {
      // Scrape articles from the Opinion section
      const articles = await scrapeArticles(driver, isPhone);

      console.log("Scraped Articles:", articles);

      // Translate titles
      const translatedHeaders = await translateTitles(
        articles.map((article) => article.title),
      );

      console.log("Translated Titles:", translatedHeaders);

      // Analyze translated headers for repeated words
      const repeatedWords = analyzeHeaders(translatedHeaders);

      console.log("Repeated Words Analysis:", repeatedWords);

      if (config.runOnBrowserStack) {
        await driver.executeScript(
          'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Most repeated words after translation is/are identified successfully!"}}',
        );
      }
    }
  } catch (error) {
    console.error(
      "An error occurred during scraping/translating/analysis:",
      error,
    );

    if (config.runOnBrowserStack) {
      await driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "An error occurred during scraping/translating/analysis: ${error}"}}`,
      );
    }
  }
})();
