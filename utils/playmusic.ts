import { Message, channelLink } from "discord.js";
import { playYoutubePlaylist } from "./musicplayer/youtube/playplaylist";
import { skip } from "./musicplayer/youtube/commands/skip";
import { resume } from "./musicplayer/youtube/commands/resume";
import { pause } from "./musicplayer/youtube/commands/pause";
import { loop } from "./musicplayer/youtube/commands/loop";
const queue = new Map();
let isPlaying = true; // Flag to track if the song is already being played
let isSkipping = false; // Flag to track if a skip operation is in progress
let disconnected = false;



const playyoutubeplaylist = async(message:Message) => {
    let serverQueue =await queue.get(message.guild.id);
    console.log(serverQueue,typeof serverQueue)
    if (message.content.startsWith('!playplaylist')) {
        playYoutubePlaylist(queue,serverQueue,message,disconnected,isPlaying,isSkipping);
    };

    if (message.content.startsWith('!skip')) {
        skip(message,serverQueue,isPlaying,isSkipping);
    };

    if (message.content.startsWith('!play') && !(message.content.startsWith('!playplaylist'))) {
        resume(message,serverQueue);
    };

    if (message.content.startsWith('!pause')) {
        pause(message,serverQueue);
    };

    if (message.content.startsWith('!loop')) {
        loop(message,serverQueue);
    };
    return;
};


export {playyoutubeplaylist};
