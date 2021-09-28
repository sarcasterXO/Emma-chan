const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = parseInt(args[0], 10);
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        try {
            const oldVolume = music.volume;

            if (isNaN(newVolume)) {
                msg.channel.send(util.embed().setDescription(`**${oldVolume}%**`)).catch((e) => console.log(e.stack));
            } else {
                if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

                if (newVolume < 0 || newVolume > 150) return msg.channel.send(util.embed().setDescription("You can only set the volume from 0 to 150.")).catch((e) => console.log(e.stack));

                await music.setVolume(newVolume);
                msg.channel.send(util.embed().setDescription(`The volume has been changed from **${oldVolume}%** to **${music.volume}%**`)).catch((e) => console.log(e.stack));
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
