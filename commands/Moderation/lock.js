const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text', 'dm', 'group'],
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
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [...params]) {
    const everyone = msg.guild.roles.cache.first();
    const bool = msg.channel.permissionsFor(everyone).has('SEND_MESSAGES');
    try {
      await msg.channel.updateOverwrite(everyone, {SEND_MESSAGES: !bool});
      const titleLocalized = bool ? 'CHANNEL_LOCKED' : 'CHANNEL_UNLOCKED';
      msg.genEmbed()
          .setTitle(`${titleLocalized}`)
          .setColor(bool ? '#ff8b94' : '#a8e6cf')
          .send();
    } catch (err) {
    }
  }

  async init() {}

};
