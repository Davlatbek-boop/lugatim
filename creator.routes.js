const {
  addCreator,
  getAllCreators,
  getCreatorById,
  updateCreatorById,
  deleteCreatorById,
  loginCreator,
  logoutCreator,
  refreshTokenCreator,
} = require("../controllers/creator.controller");

const router = require("express").Router();

router.post("/", addCreator);
router.post("/login", loginCreator);
router.get("/logout", logoutCreator);
router.get("/refreshtoken", refreshTokenCreator)
router.get("/", getAllCreators);
router.get("/:id", getCreatorById);
router.put("/:id", updateCreatorById);
router.delete("/:id", deleteCreatorById);


module.exports = router;
