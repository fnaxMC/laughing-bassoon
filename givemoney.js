const puppeteer = require("puppeteer");

const args = process.argv;

const configFile = args.length < 3 ? "config.json" : args[2];

const config = require("./" + configFile);

console.log(`Giving money to main account with config file '${configFile}'`);

(async () => {
  let bot = require("./bot.js");

  await bot.start(config);

  console.log("Bot started!");

  bot.typeCommand("!with all");
  setTimeout(() => {
    bot.typeCommand("!give-money @_Marsek#8334 all");
    process.exit();
  }, config.slowmode);
})();