import {Message} from "discord.js";

export {loop};
const loop = async(message : Message, serverQueue : any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    };
    if (!serverQueue) {
        return message
            .channel
            .send('There is no song to enable or disable loop.');
    };
    serverQueue.loop = !serverQueue.loop;
    return message
        .channel
        .send(`Loop is now ${serverQueue.loop
            ? 'enabled'
            : 'disabled'}.`);
};