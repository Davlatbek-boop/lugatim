const router = require("express").Router();

const wordsRoute = require("./words.routes");
const usersRoute = require("./users.routes");

router.use("/words", wordsRoute);
router.use("/users", usersRoute);

module.exports = router;
