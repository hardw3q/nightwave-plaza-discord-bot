const {joinVoiceChannel} = require("@discordjs/voice");

module.exports = class BotConnectionService{
    static async connectVoiceChannel(voiceChannel){
        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        return connection
    }
}