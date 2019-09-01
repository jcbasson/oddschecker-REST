class SynonymsController {
  constructor(synonymService) {
    this.synonymService = synonymService;
  }

  findAll() {
    
    return this.synonymService.findAll();
  }

  findBySynonym(synonym) {
    return this.synonymService.findBySynonym(synonym);
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

module.exports = {SynonymsController};