const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate,
      user: req.user.id,
    });

    await task.save();
    await task.populate("user", "name email");

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, status, priority, dueDate } },
      { new: true }
    ).populate("user", "name email");

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
