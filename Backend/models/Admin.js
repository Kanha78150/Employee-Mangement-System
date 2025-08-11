const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "Administrator" },
    accountRole: { type: String, default: "admin" },
    isFirstLogin: { type: Boolean, default: true },
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

module.exports = mongoose.model("Admin", adminSchema);
