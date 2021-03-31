import Discord from 'discord.js';
import Client from '../../Bat Bot/Bat Framework/dist/Client/BatClient';

import dotenv from 'dotenv';
dotenv.config()

const { version } = require('../package.json');
const client: Discord.Client = new Discord.Client({
    messageCacheMaxSize: 500,
    messageCacheLifetime: 2000,
    messageSweepInterval: 900,
    disableMentions: 'everyone',
    shards: 'auto',
    presence: {
        activity: {
            name: `!help | v${version}`,
            type: 'PLAYING'
        }
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const Bot: Client = new Client(client, {
    commandsDirectory: 'Commands',
	eventsDirectory: 'Events',
	featuresDirectory: 'Features',
    showWarns: true,
    autoSaveInterval: 15000,
    forceLoadGuilds: true,
    databaseOptions: {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    botOwners: [
        '510639833811517460'
    ]
});
Bot.setMongoPath(process.env.MONGO_URI!);
Bot.setDefaultPrefix('!');

Bot.on('databaseConnected', () => {
    console.log('Shiroko > Database connected!');
});

client.login(process.env.TOKEN);