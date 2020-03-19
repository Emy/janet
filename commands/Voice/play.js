const { Command } = require('klasa');
// const fetch = require('node-fetch');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      aliases: ['p'],
      cooldown: 5,
      description: (lang) => lang.get('PLAY_DESCRIPTION'),
      usage: '<track:string>',
    });
  }

  async run(msg, [song]) {
    const lang = msg.language;
    if (!msg.member.voice.channel) return msg.sendError('NOT_IN_VC');
    const node = this.client.shoukaku.getNode();
    let tracks = await node.rest.resolve(song);
    if (!tracks) tracks = await node.rest.resolve(song, 'youtube');
    if (!tracks) {
      return 'no tracks found...';
    } // no tracks found
    console.log(tracks);
    if (Array.isArray(tracks)) {
      const dispatcher = await this.client.queue.handleTrack(node, tracks.shift(), msg);
      tracks.forEach((track) => {
        this.client.queue.handleTrack(node, track, msg);
      });
      // Added playlist
      console.log(tracks.name);
      console.log(tracks.length);
      if (dispatcher) return await dispatcher.play();
      // Now playing
    }

    if (tracks.track) {
      const dispatcher = await this.client.queue.handleTrack(node, tracks, msg);
      if (dispatcher) return await dispatcher.play();
    }

    if (tracks.loadType === 'SEARCH_RESULT' && tracks.tracks) {
      let index = 0;
      if (tracks.tracks.length > 1) {
        // prompt
      }
      const dispatcher = await this.client.queue.handleTrack(node, tracks.tracks[index], msg);
      if (dispatcher) return await dispatcher.play();
    }
  }

  async init() {}
};
