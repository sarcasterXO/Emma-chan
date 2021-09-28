const util = require("../util");

module.exports = {
    name: "search",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length) return msg.channel.send(util.embed().setDescription(`I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)).catch((e) => console.log(e.stack));

        if (!music.node || !music.node.connected) return msg.channel.send(util.embed().setDescription("Lavalink node not connected.")).catch((e) => console.log(e.stack));

        const query = args.join(" ");
        if (!query) return msg.channel.send(util.embed().setDescription("Missing args.")).catch((e) => console.log(e.stack));

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("Couldn't find any results.")).catch((e) => console.log(e.stack));

            tracks = tracks.slice(0, 10);

            const resultMessage = await msg.channel.send(util.embed()
                .setAuthor("Search Result", msg.client.user.displayAvatarURL())
                .setDescription(tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`))
                .setFooter("Select from 1 to 10 or type \"cancel\" to cancel the command.")).catch((e) => console.log(e.stack));

            const collector = await awaitMessages();
            if (!collector) return resultMessage.edit(util.embed().setDescription("Time is up!")).catch((e) => console.log(e.stack));
            const response = collector.first();

            if (response.deletable) response.delete().catch((e) => console.log(e.stack));

            if (/^cancel$/i.exec(response.content))
                return resultMessage.edit(util.embed().setDescription("Cancelled.")).catch((e) => console.log(e.stack));

            const track = tracks[response.content - 1];
            track.requester = msg.author;
            music.queue.push(track);

            if (music.player && music.player.playing) {
                resultMessage.edit(util.embed().setDescription(`Queued [${track.info.title}](${track.info.uri}) [${msg.author}]`)).catch((e) => console.log(e.stack));
            } else {
                resultMessage.delete().catch((e) => console.log(e.stack));
            }

            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }

        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages(
                    m => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),
                    {
                        time: 10000,
                        max: 1,
                        errors: ["time"]
                    }
                );
                return collector;
            } catch {
                return null;
            }
        }
    }
};
