const mongoose = require("mongoose");
const moment = require("moment");

const gameHistorySchema = new mongoose.Schema({
  game_type: {
    type: String,
  },
  not_open_number: {
    type: String,
  },
  created_at: {
    type: String,
  }
},{timestamps : true});

module.exports = mongoose.model("gamehistory", gameHistorySchema);