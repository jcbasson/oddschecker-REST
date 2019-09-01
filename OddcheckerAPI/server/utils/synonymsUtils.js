const _ = require("lodash");

const getOddsCheckerTermBySynonym = (synonym, synonyms) => {
  const matchedSynonym = synonyms.find(doesSynonymExist(synonym));
  return  _.get(matchedSynonym, 'oddschecker_keyword', '');
};

const doesSynonymExist = synonym => oddsCheckerSynonym => {
    return  _.get(oddsCheckerSynonym, "synonyms", []).includes(synonym);
}
 

module.exports = { getOddsCheckerTermBySynonym };
