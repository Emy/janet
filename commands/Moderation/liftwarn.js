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
      permissionLevel: 5,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> <points:integer> [reason:...string]',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [member, points, reason]) {
    if (member.user.settings.warnPoints < points) points = member.user.settings.warnPoints;
    await member.user.settings.update('warnPoints', points * -1);
    const c = this.buildCase(msg, reason, points, member.user);
  }

  async init() {}

  async buildCase(msg, reason, points, user) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'LIFTWARN',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: points,
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

};
