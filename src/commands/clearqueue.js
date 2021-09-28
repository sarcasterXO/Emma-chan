const util = require("../util");

module.exports = {
    name: "clearqueue",
    description:"Clean up the queue.",
    aliases: ["clr", "clear"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send(util.embed().setDescription("Currently not playing anything.")).catch((e) => console.log(e.stack));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("Queue is empty.")).catch((e) => console.log(e.stack));

        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("You must be in a voice channel.")).catch((e) => console.log(e.stack));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel)) return msg.channel.send(util.embed().setDescription(`You must be on ${msg.guild.me.voice.channel} to use this command.`)).catch((e) => console.log(e.stack));
            
        music.queue.splice(0, 1);
        msg.react("👌").catch((err) => err.stack)
    }
};
