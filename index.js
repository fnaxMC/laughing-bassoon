const config = require("./config.json");
const puppeteer = require("puppeteer");

(async () => {
  let browser;
  if (config.headless) {
    browser = await puppeteer.launch({ headless: true });
  } else {
    browser = await puppeteer.launch({ headless: false });
  }

  const page = await browser.newPage();
  await page.goto("https://discord.com/app");
  await page.evaluate((config) => {
    function getLocalStoragePropertyDescriptor() {
      const iframe = document.createElement("iframe");
      document.head.append(iframe);
      const pd = Object.getOwnPropertyDescriptor(
        iframe.contentWindow,
        "localStorage"
      );
      iframe.remove();
      return pd;
    }

    Object.defineProperty(
      window,
      "localStorage",
      getLocalStoragePropertyDescriptor()
    );

    window.localStorage.heeeeey;
    const localStorage = getLocalStoragePropertyDescriptor().get.call(window);

    localStorage.setItem("token", config.token);
  }, config);
  await page.goto(config.url, { waitUntil: ["load", "domcontentloaded"] });

  await page.waitForSelector(".slateTextArea-1Mkdgw", {
    visible: true,
  });
  setInterval(() => {
    TypeCommand(page, "!work");
    if (Random(0, config.depallChance) === 0) {
      setTimeout(() => {
        TypeCommand(page, "!dep all");
      }, config.slowmode);
      if (Random(0, config.balChanceAfterDepall) === 0) {
        setTimeout(() => {
          TypeCommand(page, "!bal");
        }, config.slowmode);
      }
    }
  }, config.workTimeout);
})();

const TypeCommand = async (page, command) => {
  await page.evaluate(() => {
    document.querySelector(".slateTextArea-1Mkdgw").click();
  });
  await page.keyboard.type(command);
  await page.keyboard.press("Enter");
};

const Random = (min, max) => min + Math.floor(Math.random() * (max - min));