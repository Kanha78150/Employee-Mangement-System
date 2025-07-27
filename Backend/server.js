const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect DB
connectDB().then(() => createDefaultAdmin()); // ✅ Ensure default admin

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));

/**
 * ✅ Create default admin if not exists
 */
async function createDefaultAdmin() {
  try {
    const email = "admin@gmail.com";
    const password = "admin";

    const existing = await Admin.findOne({ email });
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      await Admin.create({ email, password: hashed });
      console.log(`✅ Default Admin created: ${email} / ${password}`);
    } else {
      console.log("ℹ️ Default admin already exists.");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err.message);
  }
}
