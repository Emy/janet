require('dotenv').config()

const { Client } = require('klasa');
const { config, token } = require('./config');

class rjbBotClient extends Client {

  constructor(...args) {
    super(...args);
    Client.defaultGuildSchema
      .add('filterWords', 'String', { array: true })
      .add('excludedChannels', 'textchannel', { array: true })
      .add('logChannel', 'textchannel')
      .add('reportChannel', 'textchannel');
    Client.defaultUserSchema
      .add('warnPoints', 'integer', { default: 0, min: 0 })
      .add('isClem', 'boolean', { default: false })
      .add('xp', 'integer', { default: 0, min: 0 })
      .add('level', 'integer', { default: 0, min: 0 })
  }
}

new rjbBotClient(config).login(token);
