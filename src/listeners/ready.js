module.exports = {
    name: "ready",
    exec: async (client) => {

        client.user.setStatus("dnd");
        client.user.setActivity(`Draken-kun <3`, { type: "LISTENING" });

        console.log(`Logged in as ${client.user.tag}`);

        if (client.spotify) await client.spotify.requestToken();

        const nodes = [...client.manager.nodes.values()];
        for (const node of nodes) {
            try {
                await node.connect();
            } catch (e) {
                client.manager.emit("error", e, node);
            }
        }
    }
};
