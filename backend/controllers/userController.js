const User = require("../models/User");
const Task = require("../models/Task");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalTasks = await Task.countDocuments({ user: user._id });
        const completedTasks = await Task.countDocuments({
          user: user._id,
          status: "Completed",
        });
        const pendingTasks = await Task.countDocuments({
          user: user._id,
          status: { $in: ["Pending", "In Progress"] },
        });

        return {
          ...user.toObject(),
          stats: {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate:
              totalTasks > 0
                ? ((completedTasks / totalTasks) * 100).toFixed(1)
                : 0,
          },
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
