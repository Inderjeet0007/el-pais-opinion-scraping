const seleniumConfig = require("./seleniumConfig");

module.exports = {
  maxArticles: 5,
  rapidApiKey: "RAPID_API_KEY",
  rapidApiHost: "google-translator9.p.rapidapi.com",
  rapidApiUrl: "/v2",
  runOnBrowserStack: true, // Toggle between local and BrowserStack testing
  localBrowser: { browserName: seleniumConfig.browser },
  browserstackBrowsers: [
    {
      browserName: "Edge",
      "bstack:options": {
        os: "Windows",
        osVersion: "10",
        browserVersion: "130.0",
        buildName: "ElPais Opinion Scrapping",
        sessionName: "Testing on Windows 10 Edge 130",
      },
    },
  ],
};
