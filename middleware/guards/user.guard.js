const { errorHandler } = require("../../helpers/error_handler");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtService = require("../../services/jwt.service");



module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
  console.log("authorization:",authorization);
  if (!authorization) {
    return res.status(403).send({ message: "authorization token berilmagan" });
  }
  const bearer = authorization.split(" ")[0];
  const token = authorization.split(" ")[1];
  if (bearer != "Bearer" || !token) {
    return res.status(403).send({ message: "bearer yoki token berilmagan" });
  }
  // const decodedToken = jwt.verify(token, config.get("tokenKey"));
  const decodedToken = await jwtService.verifyAccessToken(token)
  // console.log("bearer:", bearer);
  // console.log("token:",token);
  // console.log(decodedToken);
  req.user = decodedToken
  // console.log(req);
  next()
  } catch (error) {
    errorHandler(error, res)
  }
};
