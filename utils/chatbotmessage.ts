const axios = require('axios');
const sendchatbotmessage = async(message:any)=>{
    if (message.channel.id !== process.env.MSGCHANNEL) {
        return;
    };
    let authorid = message.author.id || 0;
    try {
        const response = await axios.get(`${process.env.BASEURL}&uid=${authorid}&msg=${encodeURIComponent(message.content || "HELLO")}`);
        if (response.data.cnt) {
            message
                .channel
                .send(response.data.cnt);
                return;
        };
    } catch (error) {
        console.error(error);
        return;
    };
};

export {sendchatbotmessage};