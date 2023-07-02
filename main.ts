import 'dotenv/config';
import {Client, GatewayIntentBits} from "discord.js";
const {Guilds, MessageContent, GuildMessages, GuildMembers,GuildVoiceStates} = GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers,GuildVoiceStates]
});
const fs = require('fs');
const eventFiles = fs.readdirSync('./events').filter((file:any) => file.endsWith('.ts'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0]; // Assuming your files are named "eventname.js"
    client.on(eventName, event.bind(null, client));
};

client.login(process.env.TOKEN);