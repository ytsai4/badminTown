const mongoose = require("mongoose");
const { Schema } = mongoose;
const courtSchema = new Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true, minlength: 5, maxlength: 5 },
    duration: { type: Number, required: true, min: 1, max: 24 },
    location: { type: String, required: true, minlength: 6, maxlength: 255 },
    court: { type: Number, required: true, min: 1, max: 9999 },
    amount: { type: Number, required: true, min: 1, max: 9999 },
    price: { type: Number, required: true, min: 10, max: 9999 },
    description: { type: String, minlength: 6, maxlength: 255 },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    absent: { type: [String], default: [] },
    extra: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Court", courtSchema);
