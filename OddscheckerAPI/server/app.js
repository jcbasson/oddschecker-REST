class App {
  constructor(nodeModules, startupTasks, synonymsController) {
    this.nodeModules = nodeModules;
    this.synonymsController = synonymsController;
    this.server = null;
    this.startupTasks = startupTasks;
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
    app.get("/synonyms", (req, res) =>
      this.serve(res, this.synonymsController.findAll())
    );
    app.get("/synonyms/:synonym", (req, res) =>
      this.serve(res, this.synonymsController.findBySynonym(req.params.synonym))
    );
    // Error handling
    app.use((err, req, res, next) => {
      console.log("err = ", err);
      if (err) {
        this.serveError(res, this.synonymsController.handleError(err));
        return;
      }

      next(err);
    });

    this.server = app.listen(port, () => {
      this.startupTasks();
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
