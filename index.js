require('dotenv').config()

const { Client, PermissionLevels } = require('klasa');
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
      .add('caseID', 'integer', { default: 0, min: 0, configurable: false })
    Client.defaultGuildSchema
      .add('roles', (folder) => {
        folder.add('muted', 'role')
        folder.add('memberplus', 'role')
        folder.add('memberpro', 'role')
        folder.add('memberedition', 'role')
        folder.add('genius', 'role')
        folder.add('moderator', 'role')
      })
      .add('channels', (folder) => {
        folder.add('public', 'textchannel');
        folder.add('private', 'textchannel');
        folder.add('reports', 'textchannel');
        folder.add('botspam', 'textchannel');
      })
      .add('filter', (folder) => {
        folder.add('enableWordFiltering', 'boolean', { default: true }),
        folder.add('enableSpoilerFiltering', 'boolean', { default: true });
        folder.add('words', 'filteredword', {array: true, configurable: false });
        folder.add('excludedChannels', 'textchannel', { array: true });
      })
    Client.defaultUserSchema
      .add('isMuted', 'boolean', { default:false, configurable: false })
      .add('clem', 'boolean', { default: false, configurable: false })
      .add('xpFrozen', 'boolean', { default: false, configurable: false })
      .add('warnKicked', 'boolean', { default: false, configurable: false })
      .add('warnPoints', 'integer', { default: 0, min: 0, configurable: false })
      .add('xp', 'integer', { default: 0, min: 0, configurable: false })
      .add('level', 'integer', { default: 0, min: 0, configurable: false })
      .add('cases', 'any', { array: true, configurable: false })
      .add('offlineReportPing', 'boolean', { default: false, configurable: false });



      // this.shoukaku = new Shoukaku(this, shoukakuNodes, shoukakuConfig);
      // this.queue = new Queue(this);
      // this.shoukaku.on('ready', (name, resumed) => console.log(`Lavalink Node: ${name} is now connected. This connection is ${resumed ? 'resumed' : 'a new connection'}`));
      // this.shoukaku.on('error', (name, error) => console.log(`Lavalink Node: ${name} emitted an error.`, error));
      // this.shoukaku.on('close', (name, code, reason) => console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`));
      // this.shoukaku.on('disconnected', (name, reason) => console.log(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`));
  }
}

config.permissionLevels = new PermissionLevels()
// everyone can use these commands
.add(0, () => true)
.add(1, ({ guild, member }) => (guild && guild.settings.roles.memberplus) && member.roles.cache.has(guild.settings.roles.memberplus))
.add(2, ({ guild, member }) => (guild && guild.settings.roles.memberpro) && member.roles.cache.has(guild.settings.roles.memberpro))
.add(3, ({ guild, member }) => (guild && guild.settings.roles.memberedition) && member.roles.cache.has(guild.settings.roles.memberedition))
.add(4, ({ guild, member }) => (guild && guild.settings.roles.genius) && member.roles.cache.has(guild.settings.roles.genius))
.add(5, ({ guild, member }) => (guild && guild.settings.roles.moderator) && member.roles.cache.has(guild.settings.roles.moderator))
// Members of guilds must have 'MANAGE_GUILD' permission
.add(6, ({ guild, member }) => guild && member.permissions.has('MANAGE_GUILD'), { fetch: true })
// The member using this command must be the guild owner
.add(7, ({ guild, member }) => guild && member === guild.owner, { fetch: true })
/*
 * Allows the Bot Owner to use any lower commands
 * and causes any command with a permission level 9 or lower to return an error if no check passes.
 */
.add(9, ({ author, client }) => author === client.owner, { break: true })
// Allows the bot owner to use Bot Owner only commands, which silently fail for other users.
.add(10, ({ author, client }) => author === client.owner);

new JanetClient(config).login(token);