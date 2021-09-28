const util = require("../util");

module.exports = {
    name: "stop",
    aliases: ["leave", "dc"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        try {
            await music.stop();
            msg.react("🛑").catch((e) => console.log(e.stack));
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
