class Case {
  constructor(options) {
    this.id = options.id;
    this.type = options.type;
    this.date = options.date;
    this.until = options.until;
    this.modID = options.modID;
    this.modTag = options.modTag;
    this.reason = options.reason;
    this.duration = options.duration;
    this.warnPointsAdded = options.warnPointsAdded;
    this.currentWarnPoints = options.currentWarnPoints
  }
}

module.exports = Case;