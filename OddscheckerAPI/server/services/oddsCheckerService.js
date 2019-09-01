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

  async findSubEventsByIds(subEventIds) {
    const { oddsCheckerUtils, oddsCheckerRepository } = this;
    const subEvents = oddsCheckerUtils.getSubEventsByIds(subEventIds, oddsCheckerRepository.oddschecker);
    const synonyms = oddsCheckerUtils.extractSynonyms(subEvents, oddsCheckerUtils.subEventsSynonymAccumulator);
    const synonymReplacements = await this.httpSynonymService.getSynonyms(synonyms);
    const updatedSubEvents = oddsCheckerUtils.replaceSynonymsWithOddCheckerTerms(subEvents, synonymReplacements, oddsCheckerUtils.replaceSubEventSynonym);
    
    return updatedSubEvents;
  }

  async findMarketsByIds(marketIds) {
    const { oddsCheckerUtils, oddsCheckerRepository } = this;
    const markets = oddsCheckerUtils.getMarketsByIds(marketIds, oddsCheckerRepository.oddschecker);
    const synonyms = oddsCheckerUtils.extractSynonyms(markets, oddsCheckerUtils.marketNameSynonymAccumulator);
    const synonymReplacements = await this.httpSynonymService.getSynonyms(synonyms);
    const updatedMarkets = oddsCheckerUtils.replaceSynonymsWithOddCheckerTerms(markets, synonymReplacements, oddsCheckerUtils.replaceMarketSynonym);
    
    return updatedMarkets;
  }
}

module.exports = { OddsCheckerService };
