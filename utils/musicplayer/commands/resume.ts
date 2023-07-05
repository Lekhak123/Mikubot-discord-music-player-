import {Message} from "discord.js";

export {resume};
const resume = async(message : Message, serverQueue : any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    }
    if (!serverQueue) {
        return message
            .channel
            .send('There is no song that I could play.');
    };
    if (!serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue
            .audioPlayer
            .unpause();
        return message
            .channel
            .send('Resumed the music.');
    };
    return message
        .channel
        .send('The music is already playing.');
};