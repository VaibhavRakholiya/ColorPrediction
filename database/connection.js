const mongoose = require("mongoose");

const databaseConnection = () => {
  try {
    mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("connected to db");
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = { databaseConnection };
