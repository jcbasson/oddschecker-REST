// file system module to perform file operations
const fs = require("fs");
const { formatBookMakerFeedData } = require('./utils/oddscheckerUtils')

const startupTasks = () => {
  populateOddsChecker();
};

const populateOddsChecker = () => {
  const bookMakerFeed = require("./repository/data/bookmaker-feed");
  const oddCheckerData = formatBookMakerFeedData(bookMakerFeed);
  const jsonContent = JSON.stringify(oddCheckerData);

  fs.writeFile(
    `${__dirname}/repository/data/oddschecker.json`,
    jsonContent,
    "utf8",
    (err) => {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("OddsChecker data has been populated");
    }
  );
};

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
  startupTasks
};
