import { sendchatbotmessage } from "@utils/chatbotmessage";
import { discordMusicPlayer } from "@utils/playmusic";


module.exports = async(client:any, message:any) => {
    if (message.author.bot || !message.content) {
        return;
    };

    try {
        sendchatbotmessage(message);
        discordMusicPlayer(message);
    } catch (error) {
        console.error(error);
    }
};
