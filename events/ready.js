/* -------------------------
[File Information]
Author: Mystichunterz#1922
------------------------- */

console.log("----------------------");
console.log("events > ready.js");
console.log("----------------------");

//----------------------
//  imports
//----------------------
import Event from "../classes/Event.js";
import botConfig from "../config/bot_config.js";

//----------------------
//  config
//----------------------
// Find the bot's name and prefix in the configuration array
const botNameConfig = botConfig.botConfig.find(config => config.name === "botName");
const botName = botNameConfig ? botNameConfig.id : "Nyx";

//----------------------
//  main
//----------------------
class Ready extends Event {
  async run() {
    console.log(
      `${botName} is online!\n\nLogged in as ${this.client.user.tag}!`
    );
    console.log(`Date: ${new Date().toLocaleString()} GMT+8`);
  }
}

export default Ready;
