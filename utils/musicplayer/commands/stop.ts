import {Message} from "discord.js";
import {onStateChange} from "../statechange";
const {AudioPlayerStatus, VoiceConnectionStatus} = require('@discordjs/voice');

export {stop};
const stop = async(message : Message, serverQueue : any, isPlaying : boolean, isSkipping : boolean, disconnected : boolean, queue : any,deleteQueue:any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    };
    if(!serverQueue){
        return message
            .channel
            .send('Cannot use this command.');
    };

    disconnected = true;
    await serverQueue
    .audioPlayer
    .off(AudioPlayerStatus.Idle, onStateChange); // Remove the onStateChange listener
    serverQueue
    .idleListeners
    .forEach((listener : any) => {
            serverQueue
            .audioPlayer
            .off(AudioPlayerStatus.Idle, listener);
        });
        
        await serverQueue
        .connection
        .off(VoiceConnectionStatus.Ready, serverQueue.readyListener); // Remove the readyListener
        await serverQueue
        .audioPlayer
        .stop();
        await serverQueue
        .connection
        .destroy();
        isPlaying = false;
        disconnected = true;
    queue.set(message.guild.id, serverQueue);
    queue.delete(message.guild.id, serverQueue);
    deleteQueue(message.guild.id);
    return message
        .channel
        .send(`Bot has left the voice channel in guild ${message.guild.name}`);
};