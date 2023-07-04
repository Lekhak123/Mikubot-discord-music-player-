import {Message, VoiceState} from "discord.js";
import {playmusic} from "./play";
import {onStateChange} from "./statechange";
const {AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, VoiceConnectionStatus} = require('@discordjs/voice');

const ytdl = require('ytdl-core');
export {playSingleYoutubeSong};

const playSingleYoutubeSong = async(queue : any, serverQueue : any, message : Message, disconnected : boolean, isPlaying : boolean, isSkipping : boolean) => {

    const playlistVoiceChannelId = process.env.playlistplayerchannel; // Replace with your desired voice channel ID
    const youtubecookie = process.env.youtubecookie;
    const singlelinkURL = message
        .content
        .slice(14);
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message
            .channel
            .send('You need to be in a voice channel to play a playlist.');
    };

    if (voiceChannel.id !== playlistVoiceChannelId) {
        return message
            .channel
            .send('You are not allowed to use this command in this voice channel.');
    };

    if (!singlelinkURL) {
        return message
            .channel
            .send('Invalid playlist link.');
    };

    // Fetch playlist details
    let youtubeVideoResult : any;
    try {
        let info : any;
        if (youtubecookie) {
            let requestOptions = {
                headers: {
                    cookie: youtubecookie
                }
            };
            const videoId = ytdl.getURLVideoID(singlelinkURL, {requestOptions: requestOptions});
            info = await ytdl.getInfo(videoId, {requestOptions: requestOptions});

        } else {
            const videoId = ytdl.getURLVideoID(singlelinkURL);
            info = await ytdl.getInfo(videoId);
        };
        const videoDetails = {
            title: info.videoDetails.title,
            url: info.videoDetails.video_url
        };
        youtubeVideoResult = videoDetails;
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return message
            .channel
            .send('Invalid URL or unable to fetch youtube video details.');
    };

    // Create server queue if it doesn't exist
    if (!serverQueue) {
        const queueConstructor = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
            loop: false,
            audioPlayer: createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop
                }
            })
        };
        // Add playlist songs to the queue
        const song = {
            title: youtubeVideoResult.title,
            url: youtubeVideoResult.url,
            type:"yt"
        };
        queueConstructor
            .songs
            .push(song);

        queue.set(message.guild.id, queueConstructor);
        try {

            const connection = await joinVoiceChannel({channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator});

            queueConstructor.connection = connection;
            await connection.subscribe(queueConstructor.audioPlayer);

            const readyListener = (queueConstructor : any, message : Message, queue : any) => {
                // console.log('The connection has entered the Ready state - ready to play
                // audio!');
                playmusic(message.guild, queueConstructor.songs[0], queue, disconnected, isPlaying, isSkipping);
                disconnected = false;
                connection.on(VoiceConnectionStatus.Disconnected, createDisconnectedListener(queueConstructor, message, queue));

            };

            const createDisconnectedListener = (queueConstructor : any, message : Message, queue : any) => {
                return () => {
                    disconnected = true;
                    serverQueue = null;
                    queue.delete(message.guild.id);
                    queueConstructor
                        .connection
                        .destroy();
                    queueConstructor
                        .audioPlayer
                        .off(AudioPlayerStatus.Idle, onStateChange); // Remove the onStateChange listener

                    connection.off(VoiceConnectionStatus.Ready, readyListener); // Remove the readyListener
                    return message
                        .channel
                        .send(`Bot has left the voice channel in guild <#${message.guild.name}>`);
                };
            };

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

        const song = {
            title: youtubeVideoResult.title,
            url: youtubeVideoResult.url,
            type:"yt"
        };
        serverQueue
            .songs
            .push(song);
    };

    return message
        .channel
        .send(`**${youtubeVideoResult
            ?.title || "Song"}** added to the queue.`);

};