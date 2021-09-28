const prettyMs = require("pretty-ms");
const util = require("../util");

module.exports = {
    name: "stats",
    exec: (msg) => {
        /** @type {import("lavacord").LavalinkNode[]} */
        if(!["592707660604899328"].includes(msg.author.id)) {
            return msg.channel.send(`You ain't the owner lol :)`).catch((e) => console.log(e.stack));
        }
        const nodes = [...msg.client.manager.nodes.values()];

        msg.channel.send(util.embed()
            .setAuthor("Lavalink Node(s) Stats", msg.client.user.displayAvatarURL())
            .setDescription(
                nodes.map(node  => {
                    const cpuLoad = (node.stats.cpu.lavalinkLoad * 100).toFixed(2);
                    const memUsage = (node.stats.memory.used / 1024 / 1024).toFixed(2);
                    const uptime = prettyMs(node.stats.uptime, { verbose: true, secondsDecimalDigits: 0 });

                    return `\`\`\`asciidoc
ID        :: ${node.id}
Status    :: ${node.connected ? "Connected" : "Disconnected"}
${node.connected ? `
CPU Load  :: ${cpuLoad}%
Mem Usage :: ${memUsage} MB
Uptime    :: ${uptime}
Players   :: ${node.stats.playingPlayers} of ${node.stats.players} playing` : ""}\`\`\``;
                })
            )
            .setTimestamp()
        ).catch((e) => console.log(e.stack));
    }
};
