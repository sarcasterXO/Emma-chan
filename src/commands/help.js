const util = require("../util");

const unlisted = ["eval"];

module.exports = {
    name: "help",
    aliases: ["commands", "?"],
    exec: (msg) => {
        const commands = msg.client.commands
            //.filter(c => !unlisted.includes(c.name))
            .map(c => `\`${c.name}\``);

        const embed = util.embed()
            .setAuthor("Command List", msg.client.user.displayAvatarURL())
            .setDescription(commands.join(", "))
            .setTimestamp()
            .setFooter(`Developed by Sarcaster!#3452 in memory of Groovy#7254 <3`);

        msg.channel.send(embed).catch((e) => console.log(e.stack));
    }
};
