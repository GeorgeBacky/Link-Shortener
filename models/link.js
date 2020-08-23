const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  id: String,
  url: String,
});

const Link = mongoose.model("link", linkSchema);

module.exports = Link;
