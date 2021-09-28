const { stripIndents } = require("common-tags");
const util = require("../util");
const modes = ["none", "track", "queue"];
const { queuepaginator, cleanTrackTitle } = require("../groovyUtil");


module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("Queue is empty.")).catch((e) => console.log(e.stack));

        //const queue = music.queue.map((t, i) => ``);
        //const chunked = util.chunk(queue, 9).map(x => x.join("\n"));

        try {
        const TotalSongs = music.queue.length - 1

        let pagesNum = Math.ceil(TotalSongs / 10);
            if (pagesNum === 0) pagesNum = 1;
    
        const songStrings = music.queue.map((t, i) => `${++i}) ${cleanTrackTitle(t.info.title)} [${util.millisToDuration(t.info.length)}]`);;
    
const pages = [];
for (let i = 0; i < pagesNum; i++) {
    const str = songStrings.slice(i * 10, i * 10 + 10).join('\n');
const theQueue = 
`
\`\`\`ini
     ⬐ current track   
0) ${cleanTrackTitle(music.current.info.title)} [${util.millisToDuration(music.current.info.length)}]
     ⬑ current track
${str}
Page: ${i + 1}/${pagesNum} | State: ${music.player.playing ? "Playing" : "Paused"} | Loop: ${modes[music.loop].charAt(0).toUpperCase() + modes[music.loop].slice(1)} | Volume: ${music.volume}%
\`\`\`
`
pages.push(theQueue)
}
    
        if (!args[0]) {
            if (pages.length == pagesNum && music.queue.length > 1) queuepaginator(msg.client, msg.channel, pages);
            else return msg.channel.send(pages[0]).catch((err) => console.log(err.stack));;
            /*const queueMsg = await msg.channel.send(theQueue).catch((e) => console.log(e.stack));
            if (chunked.length > 1) await util.pagination(queueMsg, msg.author, chunked).catch((e) => console.log(e.stack));*/
        }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).catch((e) => console.log(e.stack));
        }
    }
};
