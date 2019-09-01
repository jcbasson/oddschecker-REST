// file system module to perform file operations
const fs = require("fs");
const { formatBookMakerFeedData } = require("./utils/dataFormatUtils");

const startupTasks = () => {
  populateOddsCheckerData();
};

const populateOddsCheckerData = () => {
  const bookMakerFeed = require("./repository/data/bookmaker-feed");
  const oddCheckerData = formatBookMakerFeedData(bookMakerFeed);
  const jsonContent = JSON.stringify(oddCheckerData);

  try {
    fs.writeFileSync(
      `${__dirname}/repository/data/oddschecker.json`,
      jsonContent
    );
  } catch (err) {
    console.error(err);
  }
};

const getOddsCheckerData = () => {
  try {
    return JSON.parse(
      fs.readFileSync(`${__dirname}/repository/data/oddschecker.json`, "utf8")
    );
  } catch (err) {
    console.error(err);
    return false;
  }
};

const buildOddsCheckerEndpoint = () => {
  const oddschecker = getOddsCheckerData();
  const oddscheckerUtils = require("./utils/oddscheckerUtils");
  const {
    OddsCheckerRepository
  } = require("./repository/oddsCheckerRepository");
  const httpSynonymService = require("./services/httpSynonymService");
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
