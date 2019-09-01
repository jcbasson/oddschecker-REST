const _ = require("lodash");

const formatBookMakerFeedData = bookMakerFeed => {
  const makeEventId = eventIdGenerator();
  const makeSubEventId = subEventIdGenerator();

  return {
    categoryName: _.get(bookMakerFeed, "sport"),
    categoryId: 1, //TODO: Create ID generator
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

  return () => eventId++;
};

const subEventIdGenerator = () => {
  let subeventId = 0;
  return () => subeventId++;
};

module.exports = {
  formatBookMakerFeedData
};
