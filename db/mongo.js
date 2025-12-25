const mongoose = require("mongoose");
require("dotenv").config();

module.exports = {
  async connect() {
    const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/lab6";
    return mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
