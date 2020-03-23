type CaseOptions = {
  id: number, 
  type: string, 
  date: number, 
  until: number, 
  modID: string, 
  modTag: string, 
  reason: string, 
  punishment: string, 
  currentWarnPoints: number
}

export default class Case {
  id: number
  type: string
  date: number
  until: number
  modID: string
  modTag: string
  reason: string
  punishment: string
  currentWarnPoints: number

  constructor(options: CaseOptions) {
    this.id = options.id;
    this.type = options.type;
    this.date = options.date;
    this.until = options.until;
    this.modID = options.modID;
    this.modTag = options.modTag;
    this.reason = options.reason;
    this.punishment = options.punishment,
    this.currentWarnPoints = options.currentWarnPoints
  }
}