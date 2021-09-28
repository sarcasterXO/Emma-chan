const util = require("../util");

module.exports = {
    name: "skip",
    aliases: ["skipto"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const skipTo = args[0] ? parseInt(args[0]) : 1;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));

        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length)) return msg.channel.send(util.embed().setDescription("Invalid number to skip.")).catch((e) => console.log(e.stack));

        try {
            await music.skip(skipTo);
            msg.react("👌").catch(e => e.stack);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
