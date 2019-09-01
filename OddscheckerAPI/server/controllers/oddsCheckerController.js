class OddsCheckerController {
  constructor(oddsCheckerService, oddsCheckerUtils) {
    this.oddsCheckerService = oddsCheckerService;
    this.oddsCheckerUtils = oddsCheckerUtils;
  }

  async findEventsByIds(eventIds) {
    const eventIdList = this.oddsCheckerUtils.extractIdsFromParams(eventIds);
    return await this.oddsCheckerService.findEventsByIds(eventIdList);
  }

  async findSubEventsByIds(subEventIds) {
    const subEventIdList = this.oddsCheckerUtils.extractIdsFromParams(subEventIds);
    return await this.oddsCheckerService.findSubEventsByIds(subEventIdList);
  }

  async findMarketsByIds(marketIds) {
    const marketIdList = this.oddsCheckerUtils.extractIdsFromParams(marketIds);
    return await this.oddsCheckerService.findMarketsByIds(marketIdList);
  }

  async findBetsByIds(betIds) {
    const betIdList = this.oddsCheckerUtils.extractIdsFromParams(betIds);
    return await this.oddsCheckerService.findBetsByIds(betIdList);
  }

  static handleError(err) {
    let status;
    switch (err.type) {
      case "INVALID":
        status = 400;
        break;
      case "NOT_FOUND":
      default:
        status = 404;
        break;
    }
    return {
      status,
      data: {
        message: err.message,
        error: true
      }
    };
  }
}

module.exports = {OddsCheckerController};