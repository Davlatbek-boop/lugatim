const ApiError = require("../../helpers/api.error");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
    //   return res.status(401).json({ message: "Unauthorized" });\
        throw ApiError.unauthorized("Token berilmagan")
    }

    if (!allowedRoles.includes(user.role)) {
    //   return res.status(403).json({ message: "Access Denied" });
      throw ApiError.forbidden("Access Denied")
    }
    next();
  };
};
