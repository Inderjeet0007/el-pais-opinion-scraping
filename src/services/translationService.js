const axios = require("axios");
const config = require("../configs/appConfig");

async function translateTitles(titles, fromLang = "es", toLang = "en") {
  const translatedTitles = [];

  for (const title of titles) {
    try {
      const response = await axios.post(
        `https://${config.rapidApiHost}${config.rapidApiUrl}`,
        {
          source: fromLang,
          target: toLang,
          q: title,
          format: "text",
        },
        {
          headers: {
            "x-rapidapi-key": config.rapidApiKey,
            "x-rapidapi-host": config.rapidApiHost,
            "Content-Type": "application/json",
          },
        },
      );

      translatedTitles.push(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error(`⚠️ Error translating title "${title}":`, error.message);

      translatedTitles.push(`Error: Could not translate "${title}"`);
    }
  }

  return translatedTitles;
}

module.exports = { translateTitles };
