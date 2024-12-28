# El País Opinion Scraper

This project is a **web scraping tool** built using **Selenium WebDriver** and **Node.js**. It scrapes the Opinion section of the El País website, extracts article titles, and provides additional functionalities like translating the titles and analyzing the text for repeated words. The tool is designed for cross-browser testing and supports both local and remote (BrowserStack) environments.

---

## Project Structure

### **Main Files and Their Functionalities**

- **`src/configs/appConfig.js`**:

  - Configuration file to toggle between local and remote (BrowserStack) setups.
  - Contains credentials for BrowserStack and browser configurations.

- **`src/configs/seleniumConfig.js`**:

  - Contains reusable Selenium WebDriver configurations for different browsers and platforms.

- **`src/tests/utils/browserHelpers.js`**:

  - Contains utility functions to set up, retry stale elements, and tear down browsers for both local and remote environments.

- **`src/services/scrapingService.js`**:

  - Scrapes the Opinion section of El País, extracts article titles and content, and handles lazy-loading elements.

- **`src/services/translationService.js`**:

  - Integrates with a translation API (e.g., Rapid Translate) to translate article titles from Spanish to English.

- **`src/services/analysisService.js`**:

  - Analyzes translated titles and identifies repeated words across the headers.

- **`tests/opinionScraper.test.js`**:

  - Contains test cases to validate the scraper's functionality.
  - Ensures compatibility with various browser configurations.

---

## Features

- **Web Scraping**:
  - Extracts article titles and content from the Opinion section of El País.
- **Cross-Browser Testing**:
  - Supports local testing on Chrome/Edge/Firefox.
  - Remote testing on BrowserStack across multiple browsers and devices.
- **Translation**:
  - Translates Spanish titles to English using an API.
- **Cover Image Detection**:
  - Identifies and downloads cover images of the article on the machine (if any).
- **Text Analysis**:
  - Identifies and counts repeated words across translated titles.
- **Lazy Loading Handling**:
  - Scrolls and waits for elements to load dynamically.

## Configuration

### **Toggling Between Local and Remote (BrowserStack)**

The environment can be toggled using the `appConfig.js` file.

- **Key Variables in `appConfig.js`:**

  - `runOnBrowserStack`: Set to `true` for running tests on BrowserStack or `false` for local execution.
  - `localBrowser`: Configuration for local testing (e.g., Chrome).

- **Example Configuration in `browserstack.yml`:**
  ```javascript
  platforms:
  - os: OS X
    osVersion: Big Sur
    browserName: Firefox
    browserVersion: 132
  - os: Windows
    osVersion: 10
    browserName: Edge
    browserVersion: latest
  ```

## Running Tests

### Setup
- Clone Repository:
  ```
  git clone https://github.com/Inderjeet0007/el-pais-opinion-scraping.git
  cd into the cloned directory
  ```
- Install dependencies:
  ```javascript
  npm install
  ```

#### Remote
In this scenario, BrowserStack SDK has been used. Hence, before running the tests, ensure the following:

- Signup for BrowserStack using the below link: <br/>
  https://www.browserstack.com/users/sign_up
- BrowserStack Credentials:
  Update `browserstack.yml` with your `userName` and `accessKey`.
- Environment Toggle:
  Toggle `runOnBrowserStack` in `appConfig.js` to `true`.

#### Local
- Specify Browser:
  Update `browser` in `seleniumConfig.js` with browser of your choice.
- Environment Toggle:
  Toggle `runOnBrowserStack` in `appConfig.js` to `false`.

### Running Tests

Here `lint` has been added to the run command to ensure that there is no linting errors in the test.

#### Remote
- Running the Opinion Scraper test on BrowserStack
  ```javascript
  npm run test-browserstack
  ```

#### Local
- Running the Opinion Scraper test on local machine
  ```javascript
  npm run test
  ``` 
- Output:
  - Scraped articles will be logged in the console.
  - Cover image would be downloaded and stored (if any)
  - Translated titles and repeated word analysis will also be displayed.
  ```
  // Output from test execution:
  Translated Titles: [
  'Spain, a country of asylum?',
  'France: new government, same problems',
  'X, the new paradise of anorexia',
  'Other looting and the decolonization of museums',
  '‘The three borders’'
  ]
  Repeated Words Analysis: [ { word: 'of', count: 3 }, { word: 'the', count: 3 } ]

  ```
