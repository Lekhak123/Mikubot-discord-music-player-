import { Message } from "discord.js";


export {skip};
const skip = async(message:Message,serverQueue:any,isPlaying:boolean,isSkipping:boolean)=>{
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to skip the music.');
    };
    if (!serverQueue) {
        return message
            .channel
            .send('There is no song that I could skip.');
    };
    if (!isPlaying || isSkipping) {
        return message
            .channel
            .send('Skip is under cooldown. Try again in a few seconds.');
    };

    if (serverQueue.loop) {
        serverQueue
            .songs
            .shift(); // Remove the current song from the queue
    };

    serverQueue
        .audioPlayer
        .stop();
    return message
        .channel
        .send('Skipped the current song.');
};