const mongoose = require("mongoose");
const { Schema } = mongoose;
const groupSchema = new Schema({
  name: { type: String, required: true, minlength: 6, maxlength: 50 },
  description: { type: String, required: true, minlength: 6, maxlength: 255 },
  amount: { type: Number, required: true, min: 1, max: 9999 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: { type: [String], default: [] },
});

module.exports = mongoose.model("Group", groupSchema);
