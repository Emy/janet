const { Extendable } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Extendable {
  constructor(...args) {
    super(...args, {
      enabled: true,
      appliesTo: [MessageEmbed],
    });
  }

  setProvidedBy(provider) {
    const providedBy = this.lang.get('FOOTER_PROVIDED_BY');
    this.setFooter(
        this.footer.text + ` | ${providedBy} ${provider}`,
        this.footer.iconURL
    );
    return this;
  };

  send() {
    return this.msg.send(this);
  };
};
