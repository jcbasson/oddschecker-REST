class App {
  constructor(nodeModules, oddsCheckerController) {
    this.nodeModules = nodeModules;
    this.oddsCheckerController = oddsCheckerController;
    this.server = null;
  }

  init(port) {
    const { express, cors, qs } = this.nodeModules;

    const app = express();
    app.use(cors());
    app.set("query parser", function(str) {
      return qs.parse(str, {
        decode: function(s) {
          return decodeURIComponent(s);
        }
      });
    });

    app.get("/api/events/:event_id", (req, res) =>
      this.oddsCheckerController
        .findEventsByIds(req.params.event_id)
        .then(data => this.serve(res, data))
    );

    app.get("/api/subevents/:subevent_id", (req, res) =>
    this.oddsCheckerController
      .findSubEventsByIds(req.params.subevent_id)
      .then(data => this.serve(res, data))
  );

    // Error handling
    app.use((err, req, res, next) => {
      console.log("err = ", err);
      if (err) {
        this.serveError(res, this.oddsCheckerController.handleError(err));
        return;
      }

      next(err);
    });

    this.server = app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  }

  close() {
    this.server && this.server.close();
    this.server = null;
  }

  serve(res, data) {
    setTimeout(() => res.send(data), 0);
  }

  serveError(res, { status, data }) {
    res.status(status).send(data);
  }
}

module.exports = { App };
