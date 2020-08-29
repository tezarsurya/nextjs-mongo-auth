const express = require("express");
const db = require("mongoose");
const next = require("next");
const bodyParser = require("body-parser");
const authRoutes = require("./api_routes/auth.js");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();
const port = process.env.PORT || 3000;

nextApp.prepare().then(() => {
  const app = express();

  // database connection
  db.connect(
    `${process.env.DB_URL}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Database Connected");
      }
    }
  );

  // middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // route middleware
  app.use("/api", authRoutes);

  // all frontend routes
  app.get("*", (req, res) => {
    return handler(req, res);
  });

  // listen port
  app.listen(port, () => console.log(`Listening on port ${port}`));
});
