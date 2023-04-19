const Discord = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer} = require('@discordjs/voice');
const dotenv = require('dotenv');
const client = new Discord.Client({intents: 33409});
dotenv.config({path: '.env'})
client.once('ready', () => {
    console.log('Ready! on tokeng ');
});

client.on(Discord.Events.MessageCreate, async message => {
    console.log(message.content)
    if (message.content === '!play') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Please join a voice channel first!');
        }
        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        const resource = createAudioResource('https://radio.plaza.one/mp3');

        const player = createAudioPlayer();

        player.play(resource);

        connection.subscribe(player)
        await message.reply('Now playing in ' + voiceChannel.name);
    }

    if (message.content === '!stop') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Please join a voice channel first!');
        }

        voiceChannel.leave();

        message.reply('Stopping playback in ' + voiceChannel.name);
    }
});

client.login(process.env.TOKEN);
