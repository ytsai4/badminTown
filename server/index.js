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
const path = require("path");
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
app.use(cors());
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

// Set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
