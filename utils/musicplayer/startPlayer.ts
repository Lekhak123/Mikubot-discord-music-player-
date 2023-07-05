import {Message} from "discord.js";
import {playmusic} from "./play";
import {onStateChange} from "./statechange";
const {AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, VoiceConnectionStatus} = require('@discordjs/voice');

export {startPlayer};

const startPlayer = async(queue : any, serverQueue : any, message : Message, disconnected : boolean, isPlaying : boolean, isSkipping : boolean, songResult : any) => {

    // const playlistVoiceChannelId = process.env.playlistplayerchannel; // Replace with your desired voice channel ID

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    };

    if (serverQueue && !(serverQueue.channel===voiceChannel.id)) {
        return message
            .channel
            .send('Already in a voice channel.');
    };

    // Create server queue if it doesn't exist
    if (!serverQueue) {
        const queueConstructor = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            readyListener: null,
            idleListeners: [],
            disconnectedListeners: [],
            songs: [],
            volume: 5,
            playing: true,
            loop: false,
            channel:voiceChannel.id,
            audioPlayer: createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop
                }
            })
        };

        if (songResult.type === "single") {
            // Add playlist songs to the queue
            queueConstructor
                .songs
                .push(songResult.videoDetails);
        };
        if (songResult.type === "multiple") {
            // Add playlist songs to the queue
            for (const song of songResult.videoDetails) {
                queueConstructor
                    .songs
                    .push(song);
            };
        };

        queue.set(message.guild.id, queueConstructor);
        try {

            const connection = await joinVoiceChannel({channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator});

            queueConstructor.connection = connection;
            await connection.subscribe(queueConstructor.audioPlayer);
            let createDisconnectedListener = (queueConstructor : any, message : Message, queue : any) => {
                return () => {
                    disconnected = true;
                    isPlaying=false;
                    queueConstructor
                    .audioPlayer
                    .off(AudioPlayerStatus.Idle, onStateChange); // Remove the onStateChange listener
                        connection.off(VoiceConnectionStatus.Ready, readyListener); // Remove the readyListener
                        queueConstructor
                        .connection
                        .destroy();
                    queue.delete(message.guild.id);
                    return message
                        .channel
                        .send(`Bot has left the voice channel in guild ${message.guild.name}`);
                };
            };
            const readyListener = (queueConstructor : any, message : Message, queue : any) => {
                // console.log('The connection has entered the Ready state - ready to play
                // audio!');
                playmusic(message.guild, queueConstructor.songs[0], queue, disconnected, isPlaying, isSkipping, queueConstructor);
                disconnected = false;
                connection.on(VoiceConnectionStatus.Disconnected, createDisconnectedListener(queueConstructor, message, queue));
            };

            queueConstructor.readyListener = readyListener;

            connection.on(VoiceConnectionStatus.Ready, () => readyListener(queueConstructor, message, queue));

        } catch (err) {
            console.error('Error joining voice channel:', err);
            queue.delete(message.guild.id);
            return message
                .channel
                .send('There was an error joining the voice channel.');
        };
    } else {
        // Add playlist songs to the existing queue

        if (songResult.type === "single") {
            // Add playlist songs to the queue
            if(!(songResult.videoDetails in serverQueue.songs)){
                serverQueue
                    .songs
                    .push(songResult.videoDetails);
            };
        };
        if (songResult.type === "multiple") {
            // Add playlist songs to the queue
            for (const song of songResult.videoDetails) {
                if(!(song in serverQueue.songs)){
                    serverQueue
                        .songs
                        .push(song);
                };
            };
        };
        queue.set(message.guild.id, serverQueue);
        let musictype:string;
        songResult.type==="multiple"?musictype="Songs":musictype="Song";
        return message
            .channel
            .send(`${musictype} added to the queue.`);
    };
};