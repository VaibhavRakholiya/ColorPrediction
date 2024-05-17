const mongoose = require("mongoose");
const moment = require("moment");

const updatePinPassword = new mongoose.Schema({
  member_id: {
    type: String,
  },
  required: {
    type: String,
  },
  reset_status: {
    type: String,
    default:""
  },
  created_at: {
    type: String,
    default:""
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

module.exports = mongoose.model("update_pin_password", updatePinPassword);
