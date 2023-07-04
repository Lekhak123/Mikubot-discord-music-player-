import {Message} from "discord.js";

export {pause};
const pause = async(message : Message, serverQueue : any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to pause the music.');
    };
    if (!serverQueue) {
        return message
            .channel
            .send('There is no song to pause.');
    };
    if (serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue
            .audioPlayer
            .pause();
        return message
            .channel
            .send('Paused the music.');
    }
    return message
        .channel
        .send('The music is already paused.');
};