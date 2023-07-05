import playdl from "play-dl";
import {onStateChange} from "./statechange";
import {createAudioResource, AudioPlayerStatus} from '@discordjs/voice';

export {playmusic};

async function playmusic(guild : any, song : any, queue : any, disconnected : boolean, isPlaying : boolean, isSkipping : boolean,serverQueue:any) {
    // const serverQueue = queue.get(guild.id);
    // const connection = getVoiceConnection(guild.id);
    if (!song) {
        queue.delete(guild.id);
        return;
    };

    if (!serverQueue) {
        return;
    };

    if (song.source === "yt") {
        const stream = await playdl.stream(song.url, {discordPlayerCompatibility: true});
        const resource = createAudioResource(stream.stream, {inputType: stream.type});
        await serverQueue
            .audioPlayer
            .play(resource);
    };
    if (song.source === "spotify") {
        let searched = await playdl.search(`${song.title}`, {limit: 1}) // This will search the found track on youtube.
        serverQueue.songs[0]["thumbnail"]=searched[0]?.thumbnails[((searched[0]?.thumbnails?.length||1)-1)||0]?.url||"https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg";
        const stream = await playdl.stream(searched[0].url, {discordPlayerCompatibility: true});
        const resource = createAudioResource(stream.stream, {inputType: stream.type});
        await serverQueue
            .audioPlayer
            .play(resource);
    };

    
    if(serverQueue
        .idleListeners.length===0){
            let stateChangeHandler = (oldState : any, newState : any, audioPlayer : any) => {
                onStateChange(playmusic, isPlaying, isSkipping, queue, disconnected, oldState, newState, guild, audioPlayer);
            };
            serverQueue
                .idleListeners.push(stateChangeHandler);
            serverQueue
                .audioPlayer
                .on(AudioPlayerStatus.Idle, (oldState : any, newState : any) => stateChangeHandler(oldState, newState, serverQueue.audioPlayer));

                serverQueue
                    .audioPlayer
                    .on('error', (error : any) => console.error('Error playing song:', error));
        };


    serverQueue
        .textChannel
        .send(`Now playing: **${song.title}**`);
    return;
};
