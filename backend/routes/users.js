const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const userController = require("../controllers/userController");

router.get("/", auth, role("admin"), userController.getUsers);
router.get("/stats", auth, role("admin"), userController.getUserStats);

module.exports = router;
