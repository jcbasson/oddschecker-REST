const _ = require("lodash");

const formatBookMakerFeedData = bookMakerFeed => {
  const makeEventId = eventIdGenerator();
  const makeSubEventId = subEventIdGenerator();

  return {
    categoryName: _.get(bookMakerFeed, "sport"),
    categoryId: 1,
    events: _.get(bookMakerFeed, "competitions", []).map(
      generateEvent(makeEventId, makeSubEventId)
    )
  };
};

const generateEvent = (makeEventId, makeSubEventId) => competition => {
  return {
    eventId: makeEventId(),
    eventName: _.get(competition, "name", ""),
    subevents: _.get(competition, "matches", []).map(
      generateSubEvent(makeSubEventId)
    )
  };
};

const generateSubEvent = makeSubeventId => match => {
  return {
    subeventId: makeSubeventId(),
    subeventName: _.get(match, "name", ""),
    markets: _.get(match, "markets", []).map(generateMarket)
  };
};

const generateMarket = market => {
  return {
    marketId: parseInt(_.get(market, "id", 0), 10),
    marketName: _.get(market, "name", ""),
    bets: _.get(market, "outcomes", []).map(generateBet)
  };
};

const generateBet = outcome => {
  return {
    betId: parseInt(_.get(outcome, "id", 0), 10),
    betName: _.get(outcome, "name", ""),
    oddsDecimal: parseFloat(_.get(outcome, "odds", 0))
  };
};

const eventIdGenerator = () => {
  let eventId = 0;

  return () => ++eventId;
};

const subEventIdGenerator = () => {
  let subeventId = 0;
  return () => ++subeventId;
};

const getEventsByIds = (eventIds, oddsCheckerData) => {
  const events = _.get(oddsCheckerData, "events", []);
  return eventIds.map(getEventById(events));
};

const getEventById = events => eventId => {
  return events.find(e => _.get(e, "eventId") === eventId)
};

const extractEventIdsFromParams = (eventIds) => _.uniq(eventIds.split(',').map(e => parseInt(e, 10)));

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

module.exports = {
  formatBookMakerFeedData,
  getEventsByIds,
  extractSynonyms,
  eventSynonymsAccumulator,
  extractEventIdsFromParams
};
