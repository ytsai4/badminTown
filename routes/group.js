const router = require("express").Router();
const Group = require("../models").group;
const User = require("../models").user;
const Court = require("../models").court;
const groupValidation = require("../validation").groupValidation;
const ObjectId = require("mongoose").Types.ObjectId;
router.use((req, res, next) => {
  console.log("group request is processed");
  next();
});
// Find group by owner id
router.get("/own", async (req, res) => {
  try {
    const id = new ObjectId(req.user._id);
    let foundGroup = await Group.find({
      owner: id,
    }).exec();
    return res.send(foundGroup);
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Enroll group
router.get("/enroll/:_id", async (req, res) => {
  let today = new Date();
  let month = `${today.getMonth() + 1}`.padStart(2, "0");
  let startDay = `${today.getDate()}`.padStart(2, "0");
  let dateString = `${today.getFullYear()}-${month}-${startDay}`;
  let { _id } = req.params;
  try {
    let foundGroup = await Group.findById(_id).exec();
    if (foundGroup.owner.equals(req.user._id)) {
      return res.send({ msg: "球隊建立者不需加入會員" });
    }
    if (foundGroup.members.includes(req.user._id)) {
      return res.send({ msg: "您已是球隊會員" });
    }
    if (foundGroup.members.length >= foundGroup.amount) {
      return res.send({ msg: "目前球隊已滿額" });
    }
    const groupId = new ObjectId(_id);
    let extraCourts = await Court.find({
      group: groupId,
      date: { $gt: dateString },
      extra: req.user._id,
    }).exec();
    if (extraCourts) {
      extraCourts.forEach(async (court) => {
        let extraIndex = court.absent.indexOf(req.user._id);
        court.extra.splice(extraIndex, 1);
        let deleteExtra = await court.save();
      });
    }
    foundGroup.members.push(req.user._id);
    let saveGroup = await foundGroup.save();

    return res.send({ msg: "已成功加入球隊" });
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Drop group
router.get("/drop/:_id", async (req, res) => {
  let today = new Date();
  let month = `${today.getMonth() + 1}`.padStart(2, "0");
  let startDay = `${today.getDate()}`.padStart(2, "0");
  let dateString = `${today.getFullYear()}-${month}-${startDay}`;
  let { _id } = req.params;
  try {
    let foundGroup = await Group.findById(_id).exec();
    if (foundGroup.owner.equals(req.user._id)) {
      return res.send({ msg: "球隊建立者無法退出球隊" });
    }
    if (foundGroup.members.includes(req.user._id)) {
      let index = foundGroup.members.indexOf(req.user._id);

      foundGroup.members.splice(index, 1);
      const groupId = new ObjectId(_id);
      let absentCourts = await Court.find({
        group: groupId,
        date: { $gt: dateString },
        absent: req.user._id,
      });
      if (absentCourts) {
        absentCourts.forEach(async (court) => {
          let absentIndex = court.absent.indexOf(req.user._id);
          court.absent.splice(absentIndex, 1);
          let deleteAbsent = await court.save();
        });
      }
      let saveGroup = await foundGroup.save();
      return res.send({ msg: "您已退出球隊" });
    }
    return res.send({ msg: "您並非球隊會員" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Find group by member id
router.get("/member", async (req, res) => {
  try {
    let foundGroup = await Group.find({ members: req.user._id })
      .populate("owner", ["username", "email"])
      .exec();
    return res.send(foundGroup);
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Find group by group id
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundGroup = await Group.findById(_id)
      .populate("owner", ["username", "email"])
      .exec();
    return res.send(foundGroup);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Create group
router.post("/", async (req, res) => {
  // Check data
  let { error } = groupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Store new group
  let { name, description, amount } = req.body;
  let newGroup = new Group({
    name,
    description,
    amount,
    owner: req.user._id,
  });

  try {
    let saveGroup = await newGroup.save();
    let foundUser = await User.findById(req.user._id).exec();
    foundUser.groupOwn.push(saveGroup._id);
    let saveUser = await foundUser.save();
    return res.send({ msg: "已成功創建群組" });
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Delete group
router.delete("/:_id", async (req, res) => {
  let today = new Date();
  let month = `${today.getMonth() + 1}`.padStart(2, "0");
  let startDay = `${today.getDate()}`.padStart(2, "0");
  let dateString = `${today.getFullYear()}-${month}-${startDay}`;
  let { _id } = req.params;
  try {
    const groupId = new ObjectId(_id);
    let foundCourts = await Court.find({
      group: groupId,
      date: { $gte: dateString },
    }).exec();
    if (foundCourts) {
      return res
        .status(400)
        .send({ msg: "尚有未完成的場次，故無法刪除此球隊" });
    }
    let foundGroup = await Group.findById(_id).exec();
    if (foundGroup.owner._id.equals(req.user._id)) {
      let foundUser = await User.findById(req.user._id).exec();
      let index = foundUser.groupOwn.indexOf(_id);
      if (index > -1) {
        foundUser.groupOwn.splice(index, 1);
        let saveUser = await foundUser.save();
      }
      let historyCourts = await Court.deleteMany({
        group: groupId,
        date: { $lt: dateString },
      }).exec();
      let deleteGroup = await Group.deleteOne({ _id }).exec();
      return res.send({ msg: "您已刪除球隊" });
    }
    return res
      .status(403)
      .send({ msg: "您並非此球隊的創建人，故無法刪除此球隊" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
