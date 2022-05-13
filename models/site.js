const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Site", siteSchema);
