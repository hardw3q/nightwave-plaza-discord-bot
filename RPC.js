const DiscordRPC = require("discord-rpc");
const axios = require("axios")
const RPC = new DiscordRPC.Client({transport:'ipc'})
const clientID = '1098347803996065892'
DiscordRPC.register(clientID);
RPC.on('ready', async() => {
    console.log('RPC is Ready')
    await getTrackInfo()
})
async function getTrackInfo(){
    const req = await axios.get('https://api.plaza.one/status')
    //const status = JSON.parse(req)
    //console.log(req)
    console.log(req.data.song.length*1000-req.data.song.position*1000)
    setTimeout(await getTrackInfo, req.data.song.length*1000-req.data.song.position*1000)
    await setRPC(req)
    return req.data.song
}
async function setRPC(req){
    if(RPC) {
        await RPC.setActivity({
            details: `${req.data.song.title} - ${req.data.song.artist}`,
            state: `${req.data.song.title} - ${req.data.song.artist}`,
            startTimestamp: Date.now(),
            endTimestamp: Date.now() + (req.data.song.length*1000-req.data.song.position*1000),
            largeImageKey: req.data.song.artwork_src,
            largeImageText: `${req.data.song.title} - ${req.data.song.artist}`,
        }).catch(error => {
            console.log(error)
        })
        console.log('RPC UPDATED')
    }
}
RPC.login({ clientId: clientID, clientSecret: '117lShcHqx9P0jrwG1xxf63uIxfGkr-P', accessToken: process.env.TOKEN })