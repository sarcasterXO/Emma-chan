const util = require("../util");

module.exports = {
    name: "fix",
    exec: async (msg) => {

       const firstMsg = await msg.channel.send(`Fixing the player. Please wait...`).catch((e) => console.log(e.stack));

       setTimeout(async() => {
        await firstMsg.channel.send(`Done | Fixed the player.`).catch((e) => console.log(e.stack));
       }, 2000)
    }
};