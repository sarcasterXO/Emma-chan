const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        if (!music.current.info.isSeekable) return msg.channel.send(util.embed().setDescription("Current track isn't seekable.")).catch((e) => console.log(e.stack));

        const duration = args[0];
        if (!duration) return msg.channel.send(util.embed().setDescription("You must provide duration to seek. Valid duration e.g. `1:34`/`20` (in seconds).")).catch((e) => console.log(e.stack));
        if (!durationPattern.test(duration) && !/\d+/g.test(duration)) return msg.channel.send(util.embed().setDescription("You provided an invalid duration. Valid duration e.g. `1:34`/`20` (in seconds).")).catch((e) => console.log(e.stack));

        let durationMs;
        if(durationPattern.test(duration)) durationMs = util.durationToMillis(duration);
        if(!durationPattern.test(duration)) durationMs = util.secsToMillis(duration)

        if (durationMs > music.current.info.length) return msg.channel.send(util.embed().setDescription("The duration you provide exceeds the duration of the current track."));

        try {
            if(durationPattern.test(duration)) await music.player.seek(durationMs);
            if(!durationPattern.test(duration)) await music.player.seek(music.player.state.position + durationMs)
            await msg.react("👌").catch((err) => err.stack)
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
