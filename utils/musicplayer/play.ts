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

    const {stream} = await playdl.stream(song.url, {discordPlayerCompatibility: true});

    const resource = createAudioResource(stream);
    await serverQueue
        .audioPlayer
        .play(resource);
    if (!serverQueue.audioPlayer.listeners('stateChange').includes(onStateChange)) {
        // Attach the event listener for AudioPlayerStatus.Idle
        serverQueue
            .audioPlayer
            .on(AudioPlayerStatus.Idle, (oldState : any, newState : any) => {
                onStateChange(playmusic, isPlaying, isSkipping, queue, disconnected, oldState, newState, serverQueue, guild);
            });
    };

    serverQueue
        .audioPlayer
        .on('error', (error : any) => console.error('Error playing song:', error));

    serverQueue
        .textChannel
        .send(`Now playing: **${song.title}**`);
};
