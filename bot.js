const puppeteer = require("puppeteer");

let page

const start = async (config) => {
  let browser = await puppeteer.launch({ headless: config.headless });

  page = await browser.newPage();
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
};

const typeCommand = async (command) => {
  await page.evaluate(() => {
    document.querySelector(".slateTextArea-1Mkdgw").click();
  });
  await page.keyboard.type(command);
  await page.keyboard.press("Enter");
  console.log(`Sended message '${command}'`);
};

const random = (min, max) => min + Math.floor(Math.random() * (max - min));


module.exports.start = start;
module.exports.typeCommand = typeCommand;