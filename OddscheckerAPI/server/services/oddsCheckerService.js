const _ = require("lodash");

class OddsCheckerService {
  constructor(oddsCheckerRepository, oddsCheckerUtils) {
    this.oddsCheckerRepository = oddsCheckerRepository;
    this.oddsCheckerUtils = oddsCheckerUtils;
  }

  findEventsByIds(eventIds) {
    const { oddsCheckerUtils, oddsCheckerRepository } = this;
    const events = oddsCheckerUtils.getEventsByIds(eventIds, oddsCheckerRepository.oddschecker);
    console.log("events = ", events);
    const synonyms = oddsCheckerUtils.extractSynonyms(events, oddsCheckerUtils.eventSynonymsAccumulator);
    console.log("synonyms= ", synonyms)
  }
}

module.exports = { OddsCheckerService };
