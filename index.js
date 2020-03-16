require('dotenv').config()

const { Client } = require('klasa');
// const { Shoukaku } = require('shoukaku');
const { config, token } = require('./config');
// const Queue = require('./util/queue');

// const shoukakuConfig = {
//   moveOnDisconnect: true,
//   resumable: 'resumableJanet',
//   resumableTimeout: 30,
//   reconnectTries: 10,
//   restTimeout: 10000,
// };

// const shoukakuNodes = [{
//   name: process.env.VOICE_NAME,
//   host: process.env.VOICE_HOST,
//   port: process.env.VOICE_PORT,
//   auth: process.env.VOICE_PASSWORD,
// }];


class JanetClient extends Client {

  constructor(...args) {
    super(...args);
    Client.defaultClientSchema
      .add('caseID', 'integer', { default: 0, min: 0 })
    Client.defaultGuildSchema
      .add('roles', folder => {
        folder.add('muted', 'role')
        folder.add('genius', 'role')
        folder.add('moderator', 'role')
      })
      .add('filterWords', 'filteredword', { array: true })
      .add('excludedChannels', 'textchannel', { array: true })
      .add('publicLogChannel', 'textchannel')
      .add('privateLogChannel', 'textchannel')
      .add('reportChannel', 'textchannel');
    Client.defaultUserSchema
      .add('clem', 'boolean', { default: false })
      .add('xpFrozen', 'boolean', { default: false })
      .add('warnKicked', 'boolean', { default: false })
      .add('warnPoints', 'integer', { default: 0, min: 0 })
      .add('xp', 'integer', { default: 0, min: 0 })
      .add('level', 'integer', { default: 0, min: 0 })
      .add('cases', 'case', { array: true });



      // this.shoukaku = new Shoukaku(this, shoukakuNodes, shoukakuConfig);
      // this.queue = new Queue(this);
      // this.shoukaku.on('ready', (name, resumed) => console.log(`Lavalink Node: ${name} is now connected. This connection is ${resumed ? 'resumed' : 'a new connection'}`));
      // this.shoukaku.on('error', (name, error) => console.log(`Lavalink Node: ${name} emitted an error.`, error));
      // this.shoukaku.on('close', (name, code, reason) => console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`));
      // this.shoukaku.on('disconnected', (name, reason) => console.log(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`));
  }
}

new JanetClient(config).login(token);
