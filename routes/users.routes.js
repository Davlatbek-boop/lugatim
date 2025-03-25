const {
  addNewUser,
  loginUser,
  getAllUsers,
  getUserById,
  activateUser,
  refreshTokenUser,
  logoutUser,
} = require("../controllers/users.controller");
const userAdminGuard = require("../middleware/guards/user.admin.guard");
const userGuard = require("../middleware/guards/user.guard");
const userSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post("/", addNewUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)
router.post("/refresh", refreshTokenUser)
router.get("/", userGuard, getAllUsers);
router.get("/activate/:link", activateUser);
router.get("/:id", userGuard, userSelfGuard, getUserById);

module.exports = router;
