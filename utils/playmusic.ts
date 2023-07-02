const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    entersState,
    VoiceConnectionStatus,
    getVoiceConnection
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

const queue = new Map();
const playlistVoiceChannelId = process.env.playlistplayerchannel; // Replace with your desired voice channel ID
let isPlaying = true; // Flag to track if the song is already being played
let isSkipping = false; // Flag to track if a skip operation is in progress

const playyoutubeplaylist = async(message) => {
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith('!playplaylist')) {
        const playlistUrl = message
            .content
            .slice(14);
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message
                .channel
                .send('You need to be in a voice channel to play a playlist.');
        }

        if (voiceChannel.id !== playlistVoiceChannelId) {
            return message
                .channel
                .send('You are not allowed to use this command in this voice channel.');
        }

        if (!playlistUrl) {
            return message
                .channel
                .send('Invalid playlist link.');
        }

        // Fetch playlist details
        let playlist : any;
        try {
            playlist = await ytpl(playlistUrl);
        } catch (error) {
            console.error('Error fetching playlist:', error);
            return message
                .channel
                .send('Invalid playlist URL or unable to fetch playlist details.');
        }

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
            }

            try {

                const connection = await joinVoiceChannel({channelId: voiceChannel.id, guildId: voiceChannel.guild.id, adapterCreator: voiceChannel.guild.voiceAdapterCreator});

                queueConstructor.connection = connection;
                await connection.subscribe(queueConstructor.audioPlayer);
                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log('The connection has entered the Ready state - ready to play audio!');
                    play(message.guild, queueConstructor.songs[0]);
                });
            } catch (err) {
                console.error('Error joining voice channel:', err);
                queue.delete(message.guild.id);
                return message
                    .channel
                    .send('There was an error joining the voice channel.');
            }
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
            }

            return message
                .channel
                .send('Playlist added to the queue.');
        }
    }

    if (message.content.startsWith('!skip')) {
        if (!message.member.voice.channel) {
            return message
                .channel
                .send('You need to be in a voice channel to skip the music.');
        };
        if (!serverQueue) {
            return message
                .channel
                .send('There is no song that I could skip.');
        };
        if (!isPlaying || isSkipping) {
            return message
                .channel
                .send('Skip is under cooldown. Try again in a few seconds.');
        };

        if (serverQueue.loop) {
            serverQueue
                .songs
                .shift(); // Remove the current song from the queue
        };

        serverQueue
            .audioPlayer
            .stop();
        return message
            .channel
            .send('Skipped the current song.');
    }

    if (message.content.startsWith('!play') && !(message.content.startsWith('!playplaylist'))) {
        if (!message.member.voice.channel) {
            return message
                .channel
                .send('You need to be in a voice channel to play music.');
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
        }
        return message
            .channel
            .send('The music is already playing.');
    };

    if (message.content.startsWith('!pause')) {
        if (!message.member.voice.channel) {
            return message
                .channel
                .send('You need to be in a voice channel to pause the music.');
        };
        if (!serverQueue) {
            return message
                .channel
                .send('There is no song to pause.');
        };
        if (serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue
                .audioPlayer
                .pause();
            return message
                .channel
                .send('Paused the music.');
        }
        return message
            .channel
            .send('The music is already paused.');
    };

    if (message.content.startsWith('!loop')) {
        if (!message.member.voice.channel) {
            return message
                .channel
                .send('You need to be in a voice channel to enable or disable loop.');
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
};

async function play(guild : any, song : any) {
    const serverQueue = queue.get(guild.id);
    // const connection = getVoiceConnection(guild.id);
    if (!song) {
        queue.delete(guild.id);
        return;
    };

    const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio'
    });
    const resource = createAudioResource(stream, {inlineVolume: true});

    await serverQueue
        .audioPlayer
        .play(resource);

    // serverQueue     .audioPlayer     .on(AudioPlayerStatus.Idle, async() => {
    //     if (!isPlaying || isSkipping) {             return;         };
    // isPlaying = false; // Set the flag to false to indicate the song is no longer
    // being played         isSkipping = true; // Reset the skip flag
    // console.log("idle event triggered");         if (serverQueue.loop) {
    //    serverQueue                 .songs
    // .push(serverQueue.songs.shift()); // Move the current song to the end of the
    // queue         } else {             serverQueue                 .songs
    //         .shift(); // Remove the current song from the queue         };
    //  await play(guild, serverQueue.songs[0]);         setTimeout(() => {
    //    isPlaying = true; // Set the flag back to true after starting the next
    // song             isSkipping = false;         }, 5000);     }); Check if the
    // event listener is already attached
    if (!serverQueue.audioPlayer.listeners('stateChange').includes(onStateChange)) {
        // Attach the event listener for AudioPlayerStatus.Idle
        serverQueue
            .audioPlayer
            .on(AudioPlayerStatus.Idle, (oldState : any, newState : any) => {
                onStateChange(oldState, newState, serverQueue, guild);
            });
    };

    serverQueue
        .audioPlayer
        .on('error', (error : any) => console.error('Error playing song:', error));

    serverQueue
        .textChannel
        .send(`Now playing: **${song.title}**`);
};

async function onStateChange(oldState : any, newState : any, serverQueue : any, guild : any) {

    if (newState.status === AudioPlayerStatus.Idle) {
        if (!isPlaying || isSkipping) {
            return;
        };

        isPlaying = false; // Set the flag to false to indicate the song is no longer being played
        isSkipping = true; // Reset the skip flag
        console.log("idle event triggered");
        if (serverQueue
            ?.loop) {
            serverQueue
                .songs
                .push(serverQueue.songs.shift()); // Move the current song to the end of the queue
        } else {
            serverQueue
                .songs
                .shift(); // Remove the current song from the queue
        };

        if (serverQueue.songs.length > 0) {
            await play(guild, serverQueue.songs[0]);
        } else {
            queue.delete(guild.id);
        };

        setTimeout(() => {
            isPlaying = true; // Set the flag back to true after starting the next song
            isSkipping = false;
        }, 5000);
    };
};

export {playyoutubeplaylist};
