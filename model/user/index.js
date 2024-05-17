const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  point_balance:{
    type:Number,
    default:0
  },
  pin: {
    type: Number,
    default: 111111,
  },
  dob: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
    default: "",
  },
  pin_code: {
    type: Number,
  },
  address: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  Occupation: {
    type: String,
    default: "",
  },
  member_type: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "agent",
  },
  created_by: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
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

module.exports = mongoose.model("users", userSchema);
