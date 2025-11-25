const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

router.post("/", auth, taskController.createTask);
router.get("/", auth, taskController.getTasks);
router.get("/:id", auth, taskController.getTask);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);
router.get("/user/:userId", auth, taskController.getUserTasks);

module.exports = router;
