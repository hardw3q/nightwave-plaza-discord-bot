const {createAudioPlayer, createAudioResource, joinVoiceChannel} = require("@discordjs/voice");

module.exports = class BotAudioService{
   static play(connection, audioResource){
       const resource = createAudioResource(audioResource);

       const player = createAudioPlayer();

       player.play(resource);

       const subscribe = connection.subscribe(player)
       return subscribe;
   }

}