const puppeteer = require("puppeteer");

const args = process.argv;

const configFile = args.length < 3 ? "config.json" : args[2];

const config = require("./" + configFile);

console.log(`Giving money to main account with config file '${configFile}'`);

(async () => {
  let browser = await puppeteer.launch({ headless: config.headless });

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
  console.log("Bot started");
  await page.goto(config.url, { waitUntil: ["load", "domcontentloaded"] });

  await page.waitForSelector(".slateTextArea-1Mkdgw", {
    visible: true,
  });
  TypeCommand(page, "!with all");
  setTimeout(() => {
    TypeCommand(page, "!give-money @_Marsek#8334 all");
  }, config.slowmode);
})();

const TypeCommand = async (page, command) => {
  await page.evaluate(() => {
    document.querySelector(".slateTextArea-1Mkdgw").click();
  });
  await page.keyboard.type(command);
  await page.keyboard.press("Enter");
  console.log(`Sended message '${command}'`);
};

const Random = (min, max) => min + Math.floor(Math.random() * (max - min));