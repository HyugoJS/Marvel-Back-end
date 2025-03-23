const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  favorites: [
    {
      id: { type: String },
      name: { type: String },
      image: { type: String },
      description: { type: String },
    },
  ],
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
