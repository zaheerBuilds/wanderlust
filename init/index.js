const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const initData = require("./data");

const URL = "mongodb://127.0.0.1:27017/wanderlustclone";

main()
  .then(() => {
    console.log("Connected to DB for initialization...");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(URL);
}

async function initDB() {
  // Deleting the older data
  await Listing.deleteMany({});

  // Inserting new data
  // adding a user to the data
  // Getting the id from a loggedIn user

  const existingUser = await User.findOne({ username: "delta-student" });
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    author: existingUser._id,
  }));
  await Listing.insertMany(updatedData);
}

initDB();
