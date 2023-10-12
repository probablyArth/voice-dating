const mongoose = require("mongoose");

async function DBConnect() {
  try {
    const DB_URL = process.env.DB_URL;
    mongoose.connect(DB_URL);
    console.log("Connected to the database ");
  } catch (e) {
    console.log(e);
    throw new Error("Error connecting to the database");
  }
}
module.exports = DBConnect;
