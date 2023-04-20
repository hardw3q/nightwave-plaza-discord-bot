const Discord = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer} = require('@discordjs/voice');
const dotenv = require('dotenv');
const {RichPresenceAssets, Activity} = require("discord.js");
const axios = require("axios");
const JSON = require("request/lib/cookies");
const DiscordRPC = require("discord-rpc");
const {error} = require("util");
const client = new Discord.Client({intents: 33409});
const clientID = '1098347803996065892'
dotenv.config({path: '.env'})
const RPC = new DiscordRPC.Client({transport:'ipc'})
let ReadyRPC = false;

DiscordRPC.register(clientID)
client.once('ready', async () => {
    let commands = client.application?.commands
    const trackData = await getTrackInfo()
    await commands?.create({
        name: 'play',
        description: 'Play Nightwave Plaza radio in voice chat'
    })
    await commands?.create({
        name: 'stop',
        description: 'Stop Nightwave Plaza radio'
    })
    console.log('Ready! on token ');
});
RPC.on('ready', async() => {
    ReadyRPC = true;
    console.log('RPC is Ready')
})
client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()){
        return
    }
    const {commandName,options} = interaction;
    if(commandName === 'play'){
        await playRadio(interaction)
    }
    if(commandName === 'stop'){
        await stopRadio(interaction)
    }
})

async function getTrackInfo(){
    const req = await axios.get('https://api.plaza.one/status')
    //const status = JSON.parse(req)
    //console.log(req)
    console.log(req.data.song.length*1000-req.data.song.position*1000)
    setTimeout(await getTrackInfo, req.data.song.length*1000-req.data.song.position*1000)
    client.user.setActivity({
        name: `${req.data.song.title} - ${req.data.song.artist}`,
        type: 2,
        url: 'https://plaza.one/',
    })
    if(ReadyRPC && RPC) {
        await RPC.setActivity({
            details: 'https://plaza.one/',
            state: `${req.data.song.title} - ${req.data.song.artist}`,
            startTime: Date.now(),
            endTime: Date.now() + (req.data.song.length * 1000 - req.data.song.position * 1000),
            large_image: 'discord-icon',
            small_image: 'discord-icon',
            small_text: 'RPC',
            large_text: 'RPC',
        })
        console.log('RPC UPDATED')
    }
    return req.data.song
}
async function playRadio(interaction){
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply('Please join a voice channel first!');
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
    console.log('Now playing in ' + voiceChannel.name)
    await interaction.reply('Now playing in ' + voiceChannel.name);
}
async function stopRadio(interaction){
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply('Please join a voice channel first!');
    }

    voiceChannel.leave();
    console.log('Stopping playback in ' + voiceChannel.name)
    interaction.reply('Stopping playback in ' + voiceChannel.name);
}

client.login(process.env.TOKEN);
RPC.login({clientId: clientID})

