const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  stocksId: { type: String, required: false}
}, { _id: false });

const User = mongoose.model("User", userSchema);

module.exports = User;