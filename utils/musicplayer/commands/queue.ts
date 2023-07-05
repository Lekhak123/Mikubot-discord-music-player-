import {Message, EmbedBuilder} from "discord.js";

export {discordSongQueue};

function random(colors : any) {
    return colors[Math.floor(Math.random() * colors.length)];
};

const discordSongQueue = async(message : Message, serverQueue : any) => {
    if (!message.member.voice.channel) {
        return message
            .channel
            .send('You need to be in a voice channel to use this command.');
    };
    if (!serverQueue) {
        return message
            .channel
            .send('Cannot use this command.');
    };
    let queueEmbedFields : any = [];
    let queuesongs = serverQueue.songs;
    queuesongs
        .slice(0, 5)
        .map((e : any, index : any) => {
            if (index === 0) {
                queueEmbedFields.push({name: '***Queue:***', value: '\u200B', inline: true})
            } else {
                let name = `➛ ${e.title}`;
                let data = {
                    name: name,
                    value: "\u200B"
                };
                queueEmbedFields.push(data);
            };
        });
    if (queueEmbedFields.length - 1 < queuesongs.length) {
        let songsLeft = queuesongs.length - ((queueEmbedFields.length) - 1);
        if (songsLeft) {
            queueEmbedFields.push({name: `${songsLeft} more in the queue`, value: '\u200B'});
        };
    };
    const queueEmbed = new EmbedBuilder()
        .setColor(random(['#008000', '#E50000']))
        .setTitle(`Currently playing:`)
        .setDescription(`➙ ***${serverQueue
            ?.songs[0]
                ?.title || ""}***`)
        .setURL(serverQueue
            ?.songs[0]
                ?.url)
        .setThumbnail(message.guild.iconURL())
        .addFields(...queueEmbedFields)
        .setImage(`${serverQueue
            ?.songs[0]
                ?.thumbnail || "https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg"}`)
        .setTimestamp()
        .setFooter({ text:`Playing: ${serverQueue
            ?.songs[0]
                ?.title || ""}` });
    return message
        .channel
        .send({embeds: [queueEmbed]});

};