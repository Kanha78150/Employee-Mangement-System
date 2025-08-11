/**
 * Test script to debug admin login issues
 * This script will help identify what's wrong with the admin login
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for testing");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Admin model
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  accountRole: String,
  isFirstLogin: Boolean,
  lastLogin: Date,
  passwordChangedAt: Date,
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);

async function testAdminLogin() {
  try {
    console.log("🔍 Testing admin login...");
    
    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL || "admin@company.com";
    console.log(`📧 Looking for admin: ${adminEmail}`);
    
    // Find the admin
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log("❌ Admin not found in database");
      return;
    }
    
    console.log("✅ Admin found:");
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Name: ${admin.name}`);
    console.log(`   - Account Role: ${admin.accountRole}`);
    console.log(`   - Is First Login: ${admin.isFirstLogin}`);
    console.log(`   - Last Login: ${admin.lastLogin}`);
    console.log(`   - Password Changed At: ${admin.passwordChangedAt}`);
    console.log(`   - Created At: ${admin.createdAt}`);
    console.log(`   - Updated At: ${admin.updatedAt}`);
    
    // Test password comparison with environment password
    const envPassword = process.env.ADMIN_PASSWORD || "SecureAdmin123!";
    console.log(`\n🔐 Testing password comparison with: ${envPassword}`);
    
    try {
      const isPasswordValid = await bcrypt.compare(envPassword, admin.password);
      console.log(`   - Password valid: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        console.log("❌ Password doesn't match. This could be the issue!");
        console.log("💡 Try running the migration script or reset the admin password");
      }
    } catch (bcryptError) {
      console.error("❌ Bcrypt comparison error:", bcryptError.message);
    }
    
    // Test with a few common passwords
    const testPasswords = ["admin", "SecureAdmin123!", "MyNewPassword123!"];
    console.log("\n🧪 Testing with common passwords:");
    
    for (const testPassword of testPasswords) {
      try {
        const isValid = await bcrypt.compare(testPassword, admin.password);
        console.log(`   - "${testPassword}": ${isValid ? '✅ MATCH' : '❌ No match'}`);
      } catch (error) {
        console.log(`   - "${testPassword}": ❌ Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

async function main() {
  await connectDB();
  await testAdminLogin();
  await mongoose.connection.close();
  console.log("\n🔌 Database connection closed");
  process.exit(0);
}

// Run the test
main().catch(console.error);
