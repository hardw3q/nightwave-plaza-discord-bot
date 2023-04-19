
const {BotAudioService} =  require("../services/botAudioService");
const {BotConnectionService} = require('../services/botConnectionService')

const play = async (message, audioResource) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Please join a voice channel first!');
        }
        const connection = await BotConnectionService.connectVoiceChannel(voiceChannel)
        const play = await BotAudioService.play(connection, audioResource)
        await message.reply('Now playing in ' + voiceChannel.name);
        console.log('Bot play in' + voiceChannel.name)
        return play;
}
module.exports(play)