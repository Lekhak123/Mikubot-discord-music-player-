import {Message} from "discord.js";
import {playYoutubePlaylist} from "./musicplayer/youtube/addplaylist";
import {skip} from "./musicplayer/commands/skip";
import {resume} from "./musicplayer/commands/resume";
import {pause} from "./musicplayer/commands/pause";
import {loop} from "./musicplayer/commands/loop";
import {playSingleYoutubeSong} from "./musicplayer/youtube/addSingle";
let queue = new Map();
let playerstatus = new Map();

const playyoutubeplaylist = async(message : Message) => {
    let serverQueue = await queue.get(message.guild.id);
    let playerstatusQueue = await playerstatus.get(message.guild.id);
    let isPlaying = true; // Flag to track if the song is already being played
    let isSkipping = false; // Flag to track if a skip operation is in progress
    let disconnected = false;
    let currentindex=0;
    if (playerstatusQueue) {
        isPlaying = playerstatusQueue.isPlaying;
        isSkipping = playerstatusQueue.isSkipping;
        disconnected = playerstatusQueue.disconnected;
        currentindex=playerstatusQueue.currentindex;
    } else if (!playerstatusQueue) {
        const playerStatusQueueConstructor = {
            isPlaying: true,
            isSkipping: false,
            disconnected: false,
            currentindex:0,
        };
        playerstatus.set(message.guild.id, playerStatusQueueConstructor);
        playerstatusQueue = playerStatusQueueConstructor;
    };

    if (message.content.startsWith('!playplaylist')) {
        playYoutubePlaylist(queue, serverQueue, message, disconnected, isPlaying, isSkipping);
    };
    if (message.content.startsWith('!playsingle')) {
        playSingleYoutubeSong(queue, serverQueue, message, disconnected, isPlaying, isSkipping);
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
    return;
};

export {playyoutubeplaylist};
