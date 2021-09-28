const util = require("../util");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("Queue is empty."));

        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        if (!args[0]) return msg.channel.send(util.embed().setDescription("Missing args.")).catch((e) => console.log(e.stack));

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length) return msg.channel.send(util.embed().setDescription("Invalid number to remove.")).catch((e) => console.log(e.stack));

        const removed = music.queue.splice(--iToRemove, 1)[0];
        msg.channel.send(util.embed().setDescription(`Removed [${removed.info.title}](${removed.info.uri}) [${removed.requester}]`)).catch((e) => console.log(e.stack));
    }
};
