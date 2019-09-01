// file system module to perform file operations
const fs = require("fs");
const { formatBookMakerFeedData } = require("./utils/dataFormatUtils");

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
    err => {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("OddsChecker data has been populated");
    }
  );
};

const buildOddsCheckerEndpoint = () => {
  const oddschecker = require("./repository/data/oddschecker");
  const oddscheckerUtils = require("./utils/oddscheckerUtils");
  const {
    OddsCheckerRepository
  } = require("./repository/oddsCheckerRepository");
  const httpSynonymService = require('./services/httpSynonymService');
  const { OddsCheckerService } = require("./services/oddsCheckerService");
  const {
    OddsCheckerController
  } = require("./controllers/oddsCheckerController");

  const oddsCheckerRepository = new OddsCheckerRepository(oddschecker);
  const oddsCheckerService = new OddsCheckerService(
    oddsCheckerRepository,
    httpSynonymService,
    oddscheckerUtils
  );
  return new OddsCheckerController(oddsCheckerService, oddscheckerUtils);
};

module.exports = {
  buildOddsCheckerEndpoint,
  startupTasks
};
