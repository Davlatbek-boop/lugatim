const { addNewWord, getAllWords, deleteWordById, getWordsByWord } = require("../controllers/words.controller");
const roleGuard = require("../middleware/guards/role.guard");
const userGuard = require("../middleware/guards/user.guard");

const router = require("express").Router();

router.post("/",userGuard, roleGuard(["admin", "superadmin"]), addNewWord);
router.get("/",userGuard, getAllWords);
router.get("/search",userGuard, roleGuard(['user', "admin", "superadmin"]), getWordsByWord);
router.delete("/:id",userGuard, roleGuard(["superadmin"]), deleteWordById);

module.exports = router;
