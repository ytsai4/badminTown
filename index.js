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
const whitelist = ["https://badmintown.onrender.com", "http://localhost:10000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

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
app.use(cors(corsOptions));
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
  res.status(201).json({ message: "Connected to backend!" });
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
