const buildSynonymsEndpoint = () => {
  const synonyms = require("./repository/data/synonyms");
  const synonymsUtils = require("./utils/synonymsUtils");
  const { SynonymsRepository } = require("./repository/synonymsRepository");
  const { SynonymsService } = require("./services/synonymsService");
  const { SynonymsController } = require("./controllers/synonymsController");

  const synonymsRepository = new SynonymsRepository(synonyms);
  const synonymsService = new SynonymsService(
    synonymsRepository,
    synonymsUtils
  );
  return new SynonymsController(synonymsService);
};

module.exports = {
  buildSynonymsEndpoint,
};
