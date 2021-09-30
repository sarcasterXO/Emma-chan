const util = require("../util");

module.exports = {
    name: "move",
    aliases: ["mv"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const from = args[0] ? parseInt(args[0], 10) : null;
        const to = args[1] ? parseInt(args[1], 10) : null;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("Queue is empty.")).catch((e) => console.log(e.stack));

        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        if (from === null || to === null) return msg.channel.send(util.embed().setDescription(`Missing args. Example usage e.g. \`${msg.client.prefix}move 2 1\``)).catch((e) => console.log(e.stack));

        if (from === to || (isNaN(from) || from < 1 || from > music.queue.length) || (isNaN(to) || to < 1 || to > music.queue.length)) return msg.channel.send(util.embed().setDescription("Number is invalid or exceeds queue length."));

        const moved = music.queue[from - 1];

        util.moveArrayElement(music.queue, from - 1, to - 1);

        msg.channel.send(util.embed().setDescription(`Moved **${moved.info.title}** to position \`${to}\`.`)).catch((e) => console.log(e.stack));
    }
};