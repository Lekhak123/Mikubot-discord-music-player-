import {AudioPlayerStatus} from '@discordjs/voice';

export {onStateChange};

async function onStateChange(playmusic : any, isPlaying : boolean, isSkipping : boolean, queue : any, disconnected : boolean, oldState : any, newState : any, serverQueue : any, guild : any,audioPlayer:any) {
    audioPlayer.off('stateChange', onStateChange);
    audioPlayer.off(AudioPlayerStatus.Idle, onStateChange);

    if (disconnected) {
        return;
    };
    if (newState.status === AudioPlayerStatus.Idle) {
        if (!isPlaying || isSkipping || disconnected) {
            return;
        };

        isPlaying = false; // Set the flag to false to indicate the song is no longer being played
        isSkipping = true; // Reset the skip flag
        if (serverQueue &&serverQueue.songs.length > 0 && serverQueue
            ?.loop) {
            serverQueue
                .songs
                .push(serverQueue.songs.shift()); // Move the current song to the end of the queue
        } else if (serverQueue &&serverQueue.songs.length > 0) {
            serverQueue
                .songs
                .shift(); // Remove the current song from the queue
        };

        if (serverQueue &&serverQueue.songs.length > 0) {
            playmusic(guild, serverQueue.songs[0], queue, disconnected, isPlaying, isSkipping);
            return;
        } else if(!serverQueue) {
            queue.delete(guild.id);
            return;
        };

        setTimeout(() => {
            isPlaying = true; // Set the flag back to true after starting the next song
            isSkipping = false;
        }, 5000);
    };
    return;
};
