const {
  searchValidation,
  numberValidation,
  stringValidation,
} = require("../validation");
const router = require("express").Router();
const Group = require("../models").group;
const Court = require("../models").court;
router.use((req, res, next) => {
  console.log("search request is processed");
  next();
});
// Find groups
router.get("/group", async (req, res) => {
  try {
    let foundGroup = await Group.find({}).exec();
    return res.send(foundGroup);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Find group by group name
router.get("/group/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let foundGroup = await Group.find({
      name: { $regex: ".*" + name + ".*", $options: "i" },
    }).exec();
    return res.send(foundGroup);
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Find courts by date
router.post("/court", async (req, res) => {
  // Check data
  let { error } = searchValidation(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  try {
    let { startDate, endDate, withoutFull } = req.body;
    let foundCourt = await Court.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("group", ["_id", "name", "owner", "members"])
      .sort({ date: 1 })
      .exec();
    if (withoutFull && foundCourt.length !== 0) {
      let filterCourt = foundCourt.filter((court) => {
        let remain =
          court.amount -
          court.group.members.length +
          court.absent.length -
          court.extra.length;
        return remain > 0;
      });
      return res.send(filterCourt);
    }
    return res.send(foundCourt);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Find courts by date and type
router.post("/court/type", async (req, res) => {
  // Check data
  let { startDate, endDate, type, searchInput, withoutFull } = req.body;
  let foundCourt;
  try {
    if (type === "location") {
      let { error } = stringValidation(req.body);
      if (error) return res.status(400).send({ msg: error.details[0].message });

      foundCourt = await Court.find({
        date: { $lte: endDate, $gte: startDate },
        location: { $regex: ".*" + searchInput + ".*", $options: "i" },
      })
        .populate("group", ["_id", "name", "owner", "members"])
        .sort({ date: 1 })
        .exec();
    } else {
      let { error } = numberValidation(req.body);
      if (error) return res.status(400).send({ msg: error.details[0].message });

      switch (type) {
        case "price":
          foundCourt = await Court.find({
            date: { $lte: endDate, $gte: startDate },
            price: { $lte: searchInput },
          })
            .populate("group", ["_id", "name", "owner", "members"])
            .sort({ date: 1 })
            .exec();

          break;
        case "amount":
          foundCourt = await Court.find({
            date: { $lte: endDate, $gte: startDate },
            amount: { $gte: searchInput },
          })
            .populate("group", ["_id", "name", "owner", "members"])
            .sort({ date: 1 })
            .exec();
          break;
        case "court":
          foundCourt = await Court.find({
            date: { $lte: endDate, $gte: startDate },
            court: { $gte: searchInput },
          })
            .populate("group", ["_id", "name", "owner", "members"])
            .sort({ date: 1 })
            .exec();
          break;
      }
    }
    if (withoutFull && foundCourt.length !== 0) {
      let filterCourt = foundCourt.filter((court) => {
        let remain =
          court.amount -
          court.group.members.length +
          court.absent.length -
          court.extra.length;
        return remain > 0;
      });
      return res.send(filterCourt);
    }
    return res.send(foundCourt);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
module.exports = router;
