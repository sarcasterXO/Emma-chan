const util = require("../util");

const getAttachmentURL = (msg) => (msg.attachments.first() || {}).url;

module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be in ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length) return msg.channel.send(util.embed().setDescription(`I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)).catch((e) => console.log(e.stack));

        console.log(music)
        console.log(music.node)
        console.log(music.node.connected)
        if (!music.node || !music.node.connected) return msg.channel.send(util.embed().setDescription("Lavalink node not connected.")).catch((e) => console.log(e.stack));

        const query = args.join(" ") || getAttachmentURL(msg);
        if (!query) return msg.channel.send(util.embed().setDescription("Missing args.")).catch((e) => console.log(e.stack));

        
        try {
            if(query.startsWith("https://open.spotify.com/playlist/")) msg.channel.send(`Fetching the songs please wait...`).then(m => m.delete({ timeout: 10000 })).catch((err) => null);

            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`)

            if (!tracks.length) return msg.channel.send(util.embed().setDescription("Couldn't find any results.")).catch((e) => console.log(e.stack));

            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(util.embed().setDescription(`Queued \`${tracks.length}\` tracks from **${name}**.`)).catch((e) => console.log(e.stack));
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
                if (music.player && music.player.playing)
                    msg.channel.send(util.embed().setDescription(`Queued [${track.info.title}](${track.info.uri}) [${msg.author}]`))
                    m.delete({ timeout: this.current.info.length }).catch((err) => {null})
                    .catch((e) => console.log(e.stack));
            }
            
            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
