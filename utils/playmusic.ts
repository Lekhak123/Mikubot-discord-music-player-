import {Message} from "discord.js";
import {startPlayer} from "./musicplayer/startPlayer";
import {skip} from "./musicplayer/commands/skip";
import {resume} from "./musicplayer/commands/resume";
import {pause} from "./musicplayer/commands/pause";
import {loop} from "./musicplayer/commands/loop";

import { fetchPlayerInfo } from "./musicplayer/fetchPlayerInfo";
import { stop } from "./musicplayer/commands/stop";
import { discordSongQueue } from "./musicplayer/commands/queue";
let queue = new Map();
let playerstatus = new Map();


const deleteQueue = (serverid:any)=>{
    queue.delete(serverid);
    playerstatus.delete(serverid);
};

const getserverQueue =  async(serverid:any)=>{
    let serverQueue = await queue.get(serverid);
    return serverQueue
};

const discordMusicPlayer = async(message : Message) => {
    let serverQueue = await queue.get(message.guild.id);
    let playerstatusQueue = await playerstatus.get(message.guild.id);
    let isPlaying = true; // Flag to track if the song is already being played
    let isSkipping = false; // Flag to track if a skip operation is in progress
    let disconnected = false;
    if (playerstatusQueue) {
        isPlaying = playerstatusQueue.isPlaying;
        isSkipping = playerstatusQueue.isSkipping;
        disconnected = playerstatusQueue.disconnected;
    } else if (!playerstatusQueue) {
        const playerStatusQueueConstructor = {
            isPlaying: true,
            isSkipping: false,
            disconnected: false,
        };
        playerstatus.set(message.guild.id, playerStatusQueueConstructor);
        playerstatusQueue = playerStatusQueueConstructor;
    };

    if (message.content.startsWith('!play')) {
        try {

            let songResult = await fetchPlayerInfo(message.content.slice(6))
            startPlayer(queue, serverQueue, message, disconnected, isPlaying, isSkipping,songResult);
        } catch (error) {
            message.channel.send(`${error}`);
            return;
        }
    };

    if (message.content.startsWith('!skip')) {
        skip(message, serverQueue, isPlaying, isSkipping);
    };

    if (message.content.startsWith('!resume')) {
        resume(message, serverQueue);
    };

    if (message.content.startsWith('!pause')) {
        pause(message, serverQueue);
    };

    if (message.content.startsWith('!loop')) {
        loop(message, serverQueue);
    };
    if(message.content.startsWith("!stop")){
        stop(message, serverQueue, isPlaying, isSkipping,disconnected,queue,deleteQueue);
    };
    if(message.content.startsWith("!queue")){
        discordSongQueue(message, serverQueue);
    };
    return;
};

export {discordMusicPlayer,getserverQueue};
