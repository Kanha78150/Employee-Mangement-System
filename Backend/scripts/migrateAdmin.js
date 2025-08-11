/**
 * Migration script to update existing admin records with new fields
 * Run this script if you have existing admin records that need the new fields
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for migration");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Admin schema (simplified for migration)
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  accountRole: String,
  isFirstLogin: { type: Boolean, default: true },
  lastLogin: Date,
  passwordChangedAt: Date,
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);

async function migrateAdmins() {
  try {
    console.log("🔄 Starting admin migration...");
    
    // Find all admins that don't have the isFirstLogin field
    const adminsToUpdate = await Admin.find({
      $or: [
        { isFirstLogin: { $exists: false } },
        { name: { $exists: false } },
        { accountRole: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${adminsToUpdate.length} admin(s) to update`);

    for (const admin of adminsToUpdate) {
      const updates = {};
      
      // Set default values for missing fields
      if (admin.isFirstLogin === undefined) {
        updates.isFirstLogin = false; // Assume existing admins have already logged in
      }
      
      if (!admin.name) {
        updates.name = "Administrator";
      }
      
      if (!admin.accountRole) {
        updates.accountRole = "admin";
      }

      // Update the admin
      await Admin.findByIdAndUpdate(admin._id, updates);
      console.log(`✅ Updated admin: ${admin.email}`);
    }

    console.log("🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
}

async function main() {
  await connectDB();
  await migrateAdmins();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
  process.exit(0);
}

// Run the migration
main().catch(console.error);
