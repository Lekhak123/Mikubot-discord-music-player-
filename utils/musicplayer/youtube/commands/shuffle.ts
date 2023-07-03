import {Message} from "discord.js";

export {shuffle};

async function shufflearray (arr:any) {
    var j:any, x:any, index:any;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    };
    return arr;
};

const shuffle = async(message : Message, serverQueue : any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    };
    if (!serverQueue) {
        return message
            .channel
            .send('There is no song to shuffle.');
    };
    if (serverQueue.playing) {
        if (serverQueue &&serverQueue.songs.length > 0 && serverQueue
            ?.loop) {
                let firstsong =serverQueue.songs.shift();
                serverQueue.songs.shift();
                let shuffledarray = await shufflearray(serverQueue.songs);
                shuffledarray.push(firstsong);
                serverQueue.songs=shuffledarray;
        } else if (serverQueue &&serverQueue.songs.length > 0) {
            serverQueue.songs.shift();
            let shuffledarray = await shufflearray(serverQueue.songs);
            serverQueue.songs=shuffledarray;
        } else{
            return message
            .channel
            .send('Cannot shuffle the current queue.');
        };
    };
    return message
        .channel
        .send('Shuffle Complete.');
};