const _ = require("lodash");

const getOddsCheckerTermBySynonym = (synonym, synonyms) => {
  const matchedSynonym = synonyms.find(doesSynonymExist(synonym));
  return {
    oddsCheckerTerm: _.get(matchedSynonym, "oddschecker_keyword", ""),
    category: _.get(matchedSynonym, "type", ""),
    synonym
  };
};

const doesSynonymExist = synonym => oddsCheckerSynonym => {
  return _.get(oddsCheckerSynonym, "synonyms", []).includes(synonym);
};

module.exports = { getOddsCheckerTermBySynonym };
