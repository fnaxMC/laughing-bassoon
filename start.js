const puppeteer = require("puppeteer");

const args = process.argv;

const configFile = args.length < 3 ? "config.json" : args[2];

const config = require("./" + configFile);

console.log(`Starting bot with config file '${configFile}'`);

(async () => {
  let bot = require("./bot.js");

  bot.start(config);

  console.log("Bot started!");

  setInterval(() => {
    bot.typeCommand("!work");
    if (random(0, config.depallChance) === 0) {
      setTimeout(() => {
        bot.typeCommand("!dep all");
        if (random(0, config.balChanceAfterDepall) === 0) {
          setTimeout(() => {
            bot.typeCommand("!bal");
          }, config.slowmode);
        }
      }, config.slowmode);
    }
  }, config.workTimeout);

})();

const random = (min, max) => min + Math.floor(Math.random() * (max - min));