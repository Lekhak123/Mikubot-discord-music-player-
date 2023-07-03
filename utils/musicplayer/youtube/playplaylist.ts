import { Message } from "discord.js";
import { playmusic } from "../play";
const {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytpl = require('ytpl');


export {playYoutubePlaylist};

const playYoutubePlaylist = async(queue:any,serverQueue:any,message:Message,disconnected:boolean,isPlaying:boolean,isSkipping:boolean) => {
    const playlistVoiceChannelId = process.env.playlistplayerchannel; // Replace with your desired voice channel ID
    const playlistUrl = message
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

    if (!playlistUrl) {
        return message
            .channel
            .send('Invalid playlist link.');
    };

    // Fetch playlist details
    let playlist : any;
    try {
        playlist = await ytpl(playlistUrl);
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return message
            .channel
            .send('Invalid playlist URL or unable to fetch playlist details.');
    };

    const videos = playlist.items;

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
        queue.set(message.guild.id, queueConstructor);

        // Add playlist songs to the queue
        for (const video of videos) {
            const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
            const song = {
                title: video.title,
                url: videoUrl
            };
            queueConstructor
                .songs
                .push(song);
        };

        try {

            const connection = await joinVoiceChannel({channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator});
            connection.on(VoiceConnectionStatus.Disconnected, (oldState, newState) => {
                disconnected = true;
                console.log('Bot was kicked from the voice channel');
            });
            queueConstructor.connection = connection;
            await connection.subscribe(queueConstructor.audioPlayer);
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The connection has entered the Ready state - ready to play audio!');
                playmusic(message.guild, queueConstructor.songs[0], queue, disconnected, isPlaying, isSkipping);
                disconnected = false;
            });
        } catch (err) {
            console.error('Error joining voice channel:', err);
            queue.delete(message.guild.id);
            return message
                .channel
                .send('There was an error joining the voice channel.');
        };
    } else {
        // Add playlist songs to the existing queue
        for (const video of videos) {
            const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
            const song = {
                title: video.title,
                url: videoUrl
            };
            serverQueue
                .songs
                .push(song);
        };

        return message
            .channel
            .send('Playlist added to the queue.');
    };
};