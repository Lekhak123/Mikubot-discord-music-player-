import { sendchatbotmessage } from "@utils/chatbotmessage";
import { playyoutubeplaylist } from "@utils/playmusic";


module.exports = async(client:any, message:any) => {
    if (message.author.bot || !message.content) {
        return;
    };

    try {
        sendchatbotmessage(message);
        playyoutubeplaylist(message,client);
    } catch (error) {
        console.error(error);
    }
};
