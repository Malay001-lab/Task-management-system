require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const connectDB = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ SUCCESS: Connected to MongoDB Atlas");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    console.log("🎯 Host:", mongoose.connection.host);
  } catch (err) {
    console.log("❌ MongoDB Connection FAILED:");
    console.log("Error:", err.message);

    if (err.name === "MongoServerError") {
      console.log("🔑 Issue: Authentication failed");
      console.log("💡 Solution: Check username/password in MongoDB Atlas");
    } else if (err.name === "MongoNetworkError") {
      console.log("🌐 Issue: Network connection failed");
      console.log("💡 Solution: Add your IP to whitelist in MongoDB Atlas");
    } else {
      console.log("💡 Check your MONGO_URI in .env file");
    }

    process.exit(1);
  }
};

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route to check database
app.get("/api/test-db", async (req, res) => {
  try {
    const usersCount = await mongoose.connection.db
      .collection("users")
      .countDocuments();
    const tasksCount = await mongoose.connection.db
      .collection("tasks")
      .countDocuments();

    res.json({
      status: "Database is working!",
      connection:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      collections: {
        users: usersCount,
        tasks: tasksCount,
      },
      database: mongoose.connection.db.databaseName,
    });
  } catch (error) {
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// Your existing routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`📊 DB Test: http://localhost:${PORT}/api/test-db`);
});
