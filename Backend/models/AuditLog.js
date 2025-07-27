const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", schema);
