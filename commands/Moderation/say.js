const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      permissionLevel: 6,
      description: 'Says a message in a channel',
      usage: '<channel:channel> <message:...string>',
      usageDelim: ' ',
    });
  }

  async run(msg, [channel, message]) {
    channel.send(message);
  }

};
