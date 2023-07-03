import playdl from "play-dl";
import {onStateChange} from "./statechange";
import {createAudioResource, AudioPlayerStatus} from '@discordjs/voice';

export {playmusic};

async function playmusic(guild : any, song : any, queue : any, disconnected : boolean, isPlaying : boolean, isSkipping : boolean) {
    const serverQueue = queue.get(guild.id);
    // const connection = getVoiceConnection(guild.id);
    if (!song) {
        queue.delete(guild.id);
        return;
    };

    if(!serverQueue){
        console.log("not server queue");
        return;
    }
    const {stream} = await playdl.stream(song.url, {discordPlayerCompatibility: true});

    const resource = createAudioResource(stream);
    await serverQueue
        .audioPlayer
        .play(resource);

    const stateChangeHandler = (oldState : any, newState : any,audioPlayer:any) => {
        onStateChange(playmusic, isPlaying, isSkipping, queue, disconnected, oldState, newState, serverQueue, guild,audioPlayer);
    };
    serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, (oldState : any, newState : any)=>stateChangeHandler(oldState, newState,serverQueue.audioPlayer));


    serverQueue
        .audioPlayer
        .on('error', (error : any) => console.error('Error playing song:', error));

    serverQueue
        .textChannel
        .send(`Now playing: **${song.title}**`);
        return;
};