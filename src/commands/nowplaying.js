const util = require("../util");
const { progress } = require('oxy-progress-bar1');
const { time } = require('../groovyUtil');
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        let total = music.current.info.length;
        let current = music.player.state.position;
        let slider = '🔵', bar = '▬', size = 20;
        
        msg.channel.send(util.embed().setDescription(`[${music.current.info.title}](${music.current.info.uri}) [${music.current.requester}]`).setFooter(`${ music.current.info.isStream ? `🔴 LIVE` : `${progress(bar, current, total, slider, size)[0]} ${prettyMilliseconds(current)} / ${prettyMilliseconds(total)}` }`)).catch((e) => console.log(e.stack));
    }
};
