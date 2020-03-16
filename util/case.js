class Case {
  constructor(options) {
    this.id = options.id;
    this.type = options.type;
    this.date = options.date;
    this.modID = options.modID;
    this.modTag = options.modTag;
    this.reason = options.reason;
    this.duration = options.duration;
    this.warnPointsAdded = options.warnPointsAdded;
    this.currentWarnPoints = options.currentWarnPoints
  }
}

module.exports = 
  async (client, msg, user, options) => {
    const c = new Case({
      id: client.settings.caseID,
      type: options.type,
      date: Date.now(),
      modID: options.modID ? options.modID : msg.author.id,
      modTag: options.modTag ? options.modTag : msg.author.tag,
      reason: options.reason,
      duration: options.duration,
      warnPointsAdded: options.warnPointsAdded,
      currentWarnPoints: user.settings.warnPoints
    });
    await client.settings.update('caseID', client.settings.caseID + 1)
    await user.settings.update('cases', c, { action: 'add' })
    return c;
  };