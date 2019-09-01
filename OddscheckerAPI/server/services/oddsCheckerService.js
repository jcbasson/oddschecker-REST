const _ = require("lodash");

class OddsCheckerService {
  constructor(oddsCheckerRepository, httpSynonymService, oddsCheckerUtils) {
    this.oddsCheckerRepository = oddsCheckerRepository;
    this.httpSynonymService = httpSynonymService;
    this.oddsCheckerUtils = oddsCheckerUtils;
  }

  async findEventsByIds(eventIds) {
    const { oddsCheckerUtils, oddsCheckerRepository } = this;
    const events = oddsCheckerUtils.getEventsByIds(eventIds, oddsCheckerRepository.oddschecker);
    console.log("events = ", events);
    const synonyms = oddsCheckerUtils.extractSynonyms(events, oddsCheckerUtils.eventSynonymsAccumulator);
    console.log("synonyms= ", synonyms);
    const synonymReplacements = await this.httpSynonymService.getSynonyms(synonyms);
    console.log(synonymReplacements);
    const updatedEvents = oddsCheckerUtils.replaceSynonymsWithOddCheckerTerms(events, synonymReplacements);
    console.log("updatedEvents = ", updatedEvents);
  }
}

module.exports = { OddsCheckerService };
