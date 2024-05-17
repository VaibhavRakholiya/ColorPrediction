const mongoose = require("mongoose");
const moment = require("moment");

const transectionSchema = new mongoose.Schema({
  from_member_id: {
    type: String,
  },
  to_member_id: {
    type: String,
  },
  amount: {
    type: Number,
  },
  type: {
    type: String,
  },
  status: {
    type: Number, //1=pending, 2=received,3=rejected
    default: 1,
  },
  created_at: {
    type: String,
    default: moment().format("LLL"),
  },
  updated_at: {
    type: String,
    default: moment().format("LLL"),
  },
});

module.exports = mongoose.model("transections", transectionSchema);
