import { AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

export {onStateChange};



async function onStateChange(playmusic :any, isPlaying : boolean, isSkipping : boolean, queue : any, disconnected : boolean, oldState : any, newState : any, serverQueue : any, guild : any) {
    if (disconnected) {
        return;
    };
    if (newState.status === VoiceConnectionStatus.Disconnected) {
        // The bot has left the voice channel
        queue.delete(guild.id);
        console.log(`Bot left the voice channel in guild ${guild.id}`);
        serverQueue
            .connection
            .off(VoiceConnectionStatus.Disconnected, onStateChange);
        serverQueue
            .audioPlayer
            .off(AudioPlayerStatus.Idle, onStateChange);
        return;
    };

    if (newState.status === AudioPlayerStatus.Idle) {
        if (!isPlaying || isSkipping) {
            return;
        };

        isPlaying = false; // Set the flag to false to indicate the song is no longer being played
        isSkipping = true; // Reset the skip flag
        console.log("idle event triggered");
        if (serverQueue
            ?.loop) {
            serverQueue
                .songs
                .push(serverQueue.songs.shift()); // Move the current song to the end of the queue
        } else {
            serverQueue
                .songs
                .shift(); // Remove the current song from the queue
        };

        if (serverQueue.songs.length > 0) {
            await playmusic(guild, serverQueue.songs[0],queue,disconnected,isPlaying,isSkipping);
        } else {
            queue.delete(guild.id);
        };

        setTimeout(() => {
            isPlaying = true; // Set the flag back to true after starting the next song
            isSkipping = false;
        }, 5000);
    };
};
