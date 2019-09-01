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
    const synonyms = oddsCheckerUtils.extractSynonyms(events, oddsCheckerUtils.eventSynonymsAccumulator);
    const synonymReplacements = await this.httpSynonymService.getSynonyms(synonyms);
    const updatedEvents = oddsCheckerUtils.replaceSynonymsWithOddCheckerTerms(events, synonymReplacements, oddsCheckerUtils.replaceEventSynonym);
    
    return updatedEvents;
  }
}

module.exports = { OddsCheckerService };
