const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema(
  {
    id: Number,
    name: String,
    age: String,
    address: String,
    team: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", PersonSchema);
