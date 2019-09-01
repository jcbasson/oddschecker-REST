class OddsCheckerController {
  constructor(oddsCheckerService, oddsCheckerUtils) {
    this.oddsCheckerService = oddsCheckerService;
    this.oddsCheckerUtils = oddsCheckerUtils;
  }

  async findEventsByIds(eventIds) {
    const eventIdList = this.oddsCheckerUtils.extractEventIdsFromParams(eventIds);
    return await this.oddsCheckerService.findEventsByIds(eventIdList);
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