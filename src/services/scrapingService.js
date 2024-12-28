const { By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { safeRetry } = require("../tests/utils/browserHelpers");
const appConfig = require("../configs/appConfig");
const seleniumConfig = require("../configs/seleniumConfig");

async function scrapeArticles(driver, isPhone) {
  // Navigate to El País
  await driver.get("https://elpais.com/");

  console.log("✅ Navigated to El País");

  // Verifying if language is Spanish
  const langAttribute = await driver
    .findElement(By.css("html"))
    .getAttribute("lang");

  if (langAttribute && langAttribute.startsWith("es")) {
    console.log("✅ Page language is Spanish based on the lang attribute");
  }

  // Handle the cookie policy pop-up
  try {
    if (isPhone === true) {
      const acceptCookiesButton = await driver.wait(
        until.elementLocated(
          By.xpath(seleniumConfig.selectors.phoneAcceptCookie),
        ),
        10000,
      );

      await driver.wait(until.elementIsVisible(acceptCookiesButton), 5000);

      await acceptCookiesButton.click();
    } else {
      const acceptCookiesButton = await driver.wait(
        until.elementLocated(
          By.xpath(seleniumConfig.selectors.desktopAcceptCookie),
        ),
        10000,
      );

      await driver.wait(until.elementIsVisible(acceptCookiesButton), 5000);

      await acceptCookiesButton.click();
    }

    console.log("✅ Cookie policy accepted");
  } catch (err) {
    console.log("⚠️ Cookie policy pop-up not found or already accepted.");
  }

  // Navigate to the Opinion section
  if (isPhone === true) {
    const menu = await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.id(seleniumConfig.selectors.phoneHamburgerMenu)),
        5000,
      ),
    );

    await menu.click();

    const opinionLink = await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.xpath(seleniumConfig.selectors.phoneOpinion)),
        5000,
      ),
    );

    await opinionLink.click();

    console.log("✅ Navigated to the Opinion section");
  } else {
    const opinionLink = await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.css(seleniumConfig.selectors.desktopOpinion)),
        5000,
      ),
    );

    await opinionLink.click();

    console.log("✅ Navigated to the Opinion section");
  }

  // Scrape articles
  await driver.wait(
    () =>
      driver
        .executeScript("return document.readyState")
        .then((state) => state === "complete"),
    10000,
  );

  console.log("✅ Page is fully loaded");

  await driver.wait(
    until.elementsLocated(By.css(seleniumConfig.selectors.articles), 5000),
  );

  const articles = await driver.findElements(
    By.css(seleniumConfig.selectors.articles),
  );

  const results = [];

  // Create a folder to store images if it doesn't exist
  const imageFolder = path.join(__dirname, "../../assets/images");

  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder, { recursive: true });
    console.log(`✅ Image folder created at: ${imageFolder}`);
  }

  for (let i = 0; i < Math.min(appConfig.maxArticles, articles.length); i++) {
    const article = articles[i];

    await driver.executeScript(
      'arguments[0].scrollIntoView({ behavior: "instant", block: "start" });',
      article,
    );

    await driver.sleep(3000);

    // Extract title
    const titleElement = await safeRetry(
      article.findElement(By.css(seleniumConfig.selectors.articleHeading)),
    );

    const title = await safeRetry(titleElement.getText());

    // Extract content
    const contentElement = await article.findElement(
      By.css(seleniumConfig.selectors.articleContent),
    );

    const content = await safeRetry(contentElement.getText());

    // Extract and download cover image
    let coverImagePath = null;

    try {
      const imgElement = await article.findElement(
        By.css(seleniumConfig.selectors.articleImg),
      );

      const coverImageUrl = await imgElement.getAttribute(
        seleniumConfig.selectors.articleImgSrc,
      );

      if (coverImageUrl) {
        const imageResponse = await axios.get(coverImageUrl, {
          responseType: "arraybuffer",
        });

        const imageFileName = `cover_image_${i + 1}.jpg`;

        coverImagePath = path.join(imageFolder, imageFileName);

        try {
          await fs.promises.writeFile(coverImagePath, imageResponse.data);

          console.log(`✅ Cover image saved: ${coverImagePath}`);
        } catch (error) {
          console.error(
            `⚠️ Failed to save cover image for article ${i + 1}: ${error.message}`,
          );
        }
      }
    } catch (e) {
      console.log(`ℹ No cover image found for article ${i + 1}`);
    }
    results.push({ title, content, coverImagePath });
  }
  return results;
}

module.exports = { scrapeArticles };
