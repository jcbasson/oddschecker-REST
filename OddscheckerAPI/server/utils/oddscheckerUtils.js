const _ = require("lodash");

const getEventsByIds = (eventIds, oddsCheckerData) => {
  const events = _.get(oddsCheckerData, "events", []);
  return events.filter(event => eventIds.includes(_.get(event, "eventId")));
};

const extractEventIdsFromParams = eventIds =>
  _.uniq(eventIds.split(",").map(e => parseInt(e, 10)));

const extractSynonyms = (items, accumulator) => {
  return items.reduce(accumulator, []);
};

const eventSynonymsAccumulator = (synonymsAccumulator, event) => {
  const synonym = _.get(event, "eventName");
  const otherSynonyms = extractSynonyms(
    _.get(event, "subevents", []),
    subEventsSynonymAccumulator
  );
  return [...synonymsAccumulator, synonym, ...otherSynonyms];
};

const subEventsSynonymAccumulator = (synonymsAccumulator, subEvent) => {
  const synonym = _.get(subEvent, "subeventName");
  const otherSynonyms = extractSynonyms(
    _.get(subEvent, "markets", []),
    marketNameSynonymAccumulator
  );
  return [...synonymsAccumulator, synonym, ...otherSynonyms];
};

const marketNameSynonymAccumulator = (synonymsAccumulator, market) => {
  const synonym = _.get(market, "marketName");
  const otherSynonyms = extractSynonyms(
    _.get(market, "bets", []),
    betsSynonymAccumulator
  );
  return [...synonymsAccumulator, synonym, ...otherSynonyms];
};

const betsSynonymAccumulator = (synonymsAccumulator, bet) => {
  const synonym = _.get(bet, "betName");
  return [...synonymsAccumulator, synonym];
};

const replaceSynonymsWithOddCheckerTerms = (
  data,
  synonymReplacements,
  replaceFn
) => {
  return data.map(replaceFn(synonymReplacements));
};

const replaceEventSynonym = synonymReplacements => event => {
  const eventName = _.get(event, "eventName");
  const subEvents = _.get(event, "subevents", []);
  const oddsCheckerEventName = buildTermWithOddsCheckerTerms(
    eventName,
    synonymReplacements
  );
  return {
    ...event,
    eventName: oddsCheckerEventName,
    subevents: replaceSynonymsWithOddCheckerTerms(
      subEvents,
      synonymReplacements,
      replaceSubEventSynonym
    )
  };
};

const replaceSubEventSynonym = synonymReplacements => subEvent => {
  const subEventName = _.get(subEvent, "subeventName");
  const markets = _.get(subEvent, "markets", []);
  const oddsCheckerSubEventName = buildTermWithOddsCheckerTerms(
    subEventName,
    synonymReplacements
  );

  return {
    ...subEvent,
    subeventName: oddsCheckerSubEventName,
    markets: replaceSynonymsWithOddCheckerTerms(markets, synonymReplacements, replaceMarketSynonym)
  };
};

const replaceMarketSynonym = synonymReplacements => market => {
  const marketName = _.get(market, "marketName");
  const bets = _.get(market, "bets", []);
  const oddsCheckerMarketName = buildTermWithOddsCheckerTerms(
    marketName,
    synonymReplacements
  );

  return {
    ...market,
    marketName: oddsCheckerMarketName,
    bets: replaceSynonymsWithOddCheckerTerms(bets, synonymReplacements, replaceBetSynonym)
  }
}

const replaceBetSynonym = synonymReplacements => bet => {
  const betName = _.get(bet, "betName");
  const oddsCheckerBetName = buildTermWithOddsCheckerTerms(betName, synonymReplacements);
  
  return {
    ...bet,
    betName:oddsCheckerBetName
  }
}

const buildTermWithOddsCheckerTerms = (term, oddsCheckerTerms) => {
  return oddsCheckerTerms.reduce((builtTerm, oddsCheckerTerm) => {
    return _.isEmpty(oddsCheckerTerm.oddsCheckerTerm)
      ? builtTerm
      : builtTerm.replace(
          oddsCheckerTerm.synonym,
          oddsCheckerTerm.oddsCheckerTerm
        );
  }, term);
};

module.exports = {
  getEventsByIds,
  extractSynonyms,
  eventSynonymsAccumulator,
  extractEventIdsFromParams,
  replaceSynonymsWithOddCheckerTerms,
  replaceEventSynonym
};
