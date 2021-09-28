module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {
        // if the member was not cached
        if (!newState.member) await newState.guild.members.fetch(newState.id).catch((err) => null);

        const { guild: { music } } = newState;
        if (newState.member.user.equals(client.user) && !newState.channel && music.player) {
            try {
            if (music.player.playing) await music.stop();
            if (music.player) await client.manager.leave(music.guild.id);
            } catch(err) { console.log(err.stack) }
        }
    }
};
