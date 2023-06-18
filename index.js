const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoute = require("./routes").auth;
const groupRoute = require("./routes").group;
const courtRoute = require("./routes").court;
const searchRoute = require("./routes").search;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
// const path = require("path");

// set origin
const allowMethods = ["GET", "PATCH", "POST", "DELETE"];
const allowHeaders = "authorization,content-type";

// Connect to db
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("db is connected");
  })
  .catch((e) => {
    console.log(e);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Try to set cors manually
// Cors config
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://badmintown.onrender.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
// Set preflight
app.options("*", (req, res) => {
  console.log("preflight");
  if (
    req.headers.origin === "https://badmintown.onrender.com" &&
    allowMethods.includes(req.headers["access-control-request-method"]) &&
    allowHeaders.includes(req.headers["access-control-request-headers"])
  ) {
    console.log("pass");
    return res.status(204).send();
  } else {
    console.log("fail");
  }
});
// app.use(cors(corsOptions));
// app.use(express.static(path.join(__dirname, "client", "build")));
// Set routes
app.use("/api/user", authRoute);
// Search group by public
app.use("/api/search", searchRoute);
// Only login user can view info
app.use(
  "/api/groups",
  passport.authenticate("jwt", { session: false }),
  groupRoute
);
app.use(
  "/api/courts",
  passport.authenticate("jwt", { session: false }),
  courtRoute
);
app.get("/", (req, res) => {
  return res.send({ msg: "Connected to backend!" });
});
app.get("/healthz", (req, res) => {
  console.log("health check is processed");
  return res.status(204).send();
});

// // if (process.env.NODE_ENV === "production") {
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });
// // }

// Set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
