const { group } = require("../models");

const router = require("express").Router();
const Court = require("../models").court;
const Group = require("../models").group;
const courtValidation = require("../validation").courtValidation;
const ObjectId = require("mongoose").Types.ObjectId;
router.use((req, res, next) => {
  console.log("court request is processed");
  next();
});

router.get("/", async (req, res) => {
  try {
    let foundCourt = await Court.find({})
      .populate("group", ["_id", "name", "owner", "members"])
      .sort({ date: -1 })
      .exec();
    return res.send(foundCourt);
  } catch (err) {
    return res.status(500).send(err);
  }
});
router.get("/absent", async (req, res) => {
  try {
    let foundCourt = await Court.find({ absent: req.user._id })
      .populate("group", ["_id", "name", "owner", "members"])
      .sort({ date: -1 })
      .exec();
    return res.send(foundCourt);
  } catch (err) {
    return res.status(500).send(err);
  }
});
router.get("/extra", async (req, res) => {
  try {
    let foundCourt = await Court.find({ extra: req.user._id })
      .populate("group", ["_id", "name", "owner", "members"])
      .sort({ date: -1 })
      .exec();
    return res.send(foundCourt);
  } catch (err) {
    return res.status(500).send(err);
  }
});
router.get("/quit/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourt = await Court.findById(_id).exec();
    // Check date
    let now = new Date().getDate();
    if (foundCourt.date <= now) {
      return res.send({ msg: "已超過取消參加的期限" });
    }
    // For members repeat to submit
    if (foundCourt.absent.includes(req.user._id)) {
      return res.send({ msg: "您已取消參加" });
    }
    // For extra want to cancel
    if (foundCourt.extra.includes(req.user._id)) {
      let index = foundCourt.extra.indexOf(req.user._id);
      if (index > -1) {
        foundCourt.extra.splice(index, 1);
        let saveCourt = await foundCourt.save();
      }
      return res.send({ msg: "您已取消臨打" });
    }
    // For members want to cancel
    let groupId = foundCourt.group;
    let foundGroup = await Group.findOne({ _id: groupId }).exec();
    if (foundGroup.members.includes(req.user._id)) {
      foundCourt.absent.push(req.user._id);
      let saveCourt = await foundCourt.save();
      return res.send({ msg: "您已請假" });
    }
    // For user who did not enroll
    return res.send({ msg: "您並未參加此場次" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourt = await Court.findById(_id).exec();
    // Check date
    if (foundCourt.date.getDate() <= new Date().getDate()) {
      return res.send({ msg: "已超過申請參加的期限" });
    }
    // For absent members
    console.log("members");
    if (foundCourt.absent.includes(req.user._id)) {
      let index = foundCourt.absent.indexOf(req.user._id);
      if (index > -1) {
        foundCourt.absent.splice(index, 1);
        let saveCourt = await foundCourt.save();
        console.log(saveCourt);
      }
      return res.send({ msg: "您已重新參加" });
    }
    console.log("group");
    // For members are not in absent list
    let groupId = foundCourt.group;
    let foundGroup = await Group.findById(groupId).exec();
    if (foundGroup.owner.equals(req.user._id)) {
      return res.send({ msg: "隊長不需要報名場次" });
    }
    console.log("members join");
    if (foundGroup.members.includes(req.user._id)) {
      return res.send({ msg: "會員已參加此場次" });
    }
    // For extra repeat submit
    console.log("extra join");
    if (foundCourt.extra.includes(req.user._id)) {
      return res.send({ msg: "您已報名參加" });
    }

    // For user who is not a member wants to enroll
    console.log("join");
    foundCourt.extra.push(req.user._id);
    let saveCourt = await foundCourt.save();
    return res.send({ msg: "您已成功報名" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Find courts by group id
router.get("/findbygroup/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    const id = new ObjectId(_id);
    let foundCourt = await Court.find({
      group: id,
    })
      .populate("group", ["_id", "name", "owner", "members"])
      .sort({ date: -1 })
      .exec();
    return res.send(foundCourt);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  // Check data
  let { error } = courtValidation(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  // Check date

  let { date, startTime } = req.body;
  let now = new Date().getTime();
  let set = new Date(date).getTime();
  if (set < now) {
    return res.status(400).send({ msg: "不能設定過去的時間" });
  }
  let [hour, minute] = startTime.split(":");
  if (+hour > 24 || +minute > 59) {
    console.log("time");
    return res.status(400).send({ msg: "請輸入24小時制的時間" });
  }
  // Store new court
  let { duration, location, court, amount, price, group, description } =
    req.body;

  try {
    let foundGroup = await Group.findById(group).exec();
    if (amount < foundGroup.members.length) {
      return res.status(400).send({ msg: "人數上限不應小於球隊人數" });
    }
    let newCourt = new Court({
      date,
      startTime,
      duration,
      location,
      court,
      amount,
      price,
      group: new ObjectId(group),
      description,
    });
    let saveCourt = await newCourt.save();
    return res.send({ msg: "已創建新場次" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
module.exports = router;
