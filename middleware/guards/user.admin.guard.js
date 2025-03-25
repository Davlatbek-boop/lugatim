const ApiError = require("../../helpers/api.error");

module.exports = function (req, res, next) {
  if (req.user.role != "admin1") {
    throw ApiError.forbidden("Ruxsat berilmagan foydalanuvchi")
    // return res.status(403).send({ message: "Ruxsat berilmagan foydalanuvchi" });
  }
  next();
};
