const _ = require("lodash");

class SynonymsService {
  constructor(synonymRepository, synonymsUtils) {
    this.synonymRepository = synonymRepository;
    this.getOddsCheckerTermBySynonym = _.memoize(
      synonymsUtils.getOddsCheckerTermBySynonym
    );
  }

  findAll() {
    return _.get(this, "synonymRepository.synonyms", []);
  }

  findBySynonym(synonym) {
    return this.getOddsCheckerTermBySynonym(
      synonym,
      this.synonymRepository.synonyms
    );
  }
}

module.exports = { SynonymsService };
