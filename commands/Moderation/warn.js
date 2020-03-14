const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      guarded: true,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> <points:integer> [reason:...string]',
      usageDelim: ' ',
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(message, [member, points, reason]) {
    let warnPoints = member.user.settings.get('warnPoints');
    member.user.settings.update('warnPoints', warnPoints += points)
    if (warnPoints >= 600) {
      // ban
    }

    if (warnPoints >= 400) {
      // kick
    }
  }

  async init() {}
};
