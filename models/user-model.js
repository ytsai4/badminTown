const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 6, maxlength: 50 },
  hash: { type: String, required: true, minlength: 8, maxlength: 255 },
  groupOwn: { type: [String], default: [] },
});
// instance method
userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.hash);
    return cb(null, result);
  } catch (error) {
    return cb(error, result);
  }
};
// Mongoose middleware
// Check if it is a new user or reset password, then hash password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("hash")) {
    const hash = await bcrypt.hash(this.hash, 10);
    this.hash = hash;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
