const _ = require("lodash");

const getEventsByIds = (eventIds, oddsCheckerData) => {
  const events = _.get(oddsCheckerData, "events", []);
  return eventIds.map(getEventById(events));
};

const getEventById = events => eventId => {
  return events.find(e => _.get(e, "eventId") === eventId);
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
  const oddsCheckerSubEventName = buildTermWithOddsCheckerTerms(
    subEventName,
    synonymReplacements
  );

  return {
    ...subEvent,
    subeventName: oddsCheckerSubEventName
  };
};

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
