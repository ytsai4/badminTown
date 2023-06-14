const router = require("express").Router();
const User = require("../models").user;
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const editValidation = require("../validation").editValidation;
const passwordValidation = require("../validation").passwordValidation;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
router.use((req, res, next) => {
  console.log("auth request is processed");
  next();
});
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundUser = await User.findById(_id).exec();
    return res.send(foundUser);
  } catch {
    res.status(500).send({ msg: "找不到該用戶" });
  }
});
router.post("/register", async (req, res) => {
  // Check if data meet requirements
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  // Check if email exist
  const emailExist = await User.findOne({ email: req.body.email }).exec();
  if (emailExist) {
    return res.status(400).send({ msg: "此信箱已被註冊" });
  }

  // Store new user
  let { username, email, password } = req.body;
  let newUser = new User({
    username,
    email,
    hash: password,
  });
  try {
    newUser.save();
    return res.send({ msg: "已成功註冊" });
  } catch {
    res.status(500).send({ msg: "註冊失敗" });
  }
});

router.post("/login", async (req, res) => {
  // Check if data meet requirements
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  let { email, password } = req.body;
  try {
    // Check if email exist
    let foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res
        .status(401)
        .send({ msg: "查無此帳號，請重新確認信箱是否輸入正確" });
    }
    // Compare password
    foundUser.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send(err);
      if (!isMatch) return res.status(401).send({ msg: "密碼錯誤" });
      // Make json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "登入成功",
        token: "JWT " + token,
        user: foundUser,
      });
    });
  } catch (error) {
    res.status(500).send({ msg: "登入失敗" });
  }
});

router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Check if data meet requirements
    let { error } = editValidation(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });
    let { username } = req.body;
    try {
      // Check if email exist
      let updateUser = await User.updateOne(
        { _id: req.user._id },
        { username },
        { runValidators: true }
      ).exec();
      return res.send({ msg: "已成功變更名稱" });
    } catch (error) {
      res.status(500).send({ msg: "變更失敗" });
    }
  }
);

router.patch(
  "/password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Check if data meet requirements
    let { error } = passwordValidation(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });
    let { oldPassword, newPassword } = req.body;
    try {
      // Check if email exist
      let foundUser = await User.findById(req.user._id).exec();
      if (!foundUser) {
        return res.status(401).send({ msg: "查無此帳號" });
      }
      // Compare password
      foundUser.comparePassword(oldPassword, async (err, isMatch) => {
        if (err) return res.status(500).send(err);
        if (!isMatch) return res.status(401).send({ msg: "密碼錯誤" });
        const hash = await bcrypt.hash(newPassword, 10);
        let updateUser = await User.updateOne(
          { _id: req.user._id },
          { hash },
          { runValidators: true, new: true }
        ).exec();
        return res.send({ msg: "已成功變更密碼" });
      });
    } catch (error) {
      res.status(500).send({ msg: "變更失敗" });
    }
  }
);

module.exports = router;
