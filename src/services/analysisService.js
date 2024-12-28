function analyzeHeaders(headers) {
  const wordCounts = {};
  headers
    .join(" ")
    .split(" ")
    .forEach((word) => {
      word = word.toLowerCase().replace(/[^\w]/g, ""); // Normalize words

      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

  const repeatedWords = Object.entries(wordCounts)
    .filter(([, count]) => count > 2)
    .map(([word, count]) => ({ word, count }));

  return repeatedWords;
}

module.exports = { analyzeHeaders };
