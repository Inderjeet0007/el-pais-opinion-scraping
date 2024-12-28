module.exports = {
  browser: "MicrosoftEdge",
  implicitWait: 5000, // Wait 5 seconds for elements to appear
  selectors: {
    phoneAcceptCookie: '//*[@id="pmConsentWall"]/div/div/div[2]/div[1]/a',
    desktopAcceptCookie: '//button[@id="didomi-notice-agree-button"]',
    phoneHamburgerMenu: "btn_open_hamburger",
    phoneOpinion: '//*[@id="hamburger_container"]/nav/div[1]/ul/li[2]/a',
    desktopOpinion: 'a[href*="opinion"]',
    articles: "article",
    articleHeading: "h2",
    articleContent: "p",
    articleImg: "img",
    articleImgSrc: "src",
  },
};
