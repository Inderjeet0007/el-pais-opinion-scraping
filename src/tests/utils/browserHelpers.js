const { Builder } = require("selenium-webdriver");
const config = require("../../configs/appConfig");
const seleniumConfig = require("../../configs/seleniumConfig");

async function setupBrowser(browserConfig, isPhone) {
  let driver;

  if (config.runOnBrowserStack) {
    // BrowserStack setup
    console.log(
      `Setting up BrowserStack via SDK - ${isPhone === true ? "Phone" : "Desktop"}`,
    );

    driver = new Builder()
      .usingServer("http://localhost:4444/wd/hub")
      .withCapabilities({
        ...browserConfig,
      })
      .build();
  } else {
    // Local setup
    console.log("Setting up local browser...");

    driver = new Builder().forBrowser(config.localBrowser.browserName).build();
  }

  if (isPhone === false) {
    await driver.manage().window().maximize();
  }

  await driver.manage().setTimeouts({ implicit: seleniumConfig.implicitWait });

  console.log("✅ Browser setup complete.");

  return driver;
}

async function safeRetry(element) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await element;
    } catch (error) {
      if (error.name === "StaleElementReferenceError") {
        console.warn("Stale element reference, retrying...");

        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay before retry
      } else {
        throw error; // Re-throw if it's not a stale element error
      }
    }
  }
  throw new Error("Failed to retrieve text after multiple attempts.");
}

async function teardownBrowser(driver) {
  if (driver) {
    await driver.quit();

    console.log("Browser teardown complete.");
  }
}

module.exports = { setupBrowser, safeRetry, teardownBrowser };
