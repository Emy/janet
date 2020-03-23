const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: [],
      autoAliases: true,
      bucket: 1,
      cooldown: 0,
      promptLimit: 0,
      promptTime: 30000,
      deletable: false,
      guarded: false,
      nsfw: false,
      permissionLevel: 7,
      description: 'Locks the channel by blocking @everyone from sending messages.',
      extendedHelp: 'No extended help available.',
      usage: '',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [...params]) {
    const everyone = msg.guild.roles.cache.first();
    const isLocked = msg.channel.permissionsFor(everyone).has('SEND_MESSAGES');
    await msg.channel.updateOverwrite(everyone, {SEND_MESSAGES: !isLocked});
    msg.send(`Channel ${isLocked ? 'locked' : 'unlocked'}.`)
    msg.delete();
  }

  async init() {}

};
