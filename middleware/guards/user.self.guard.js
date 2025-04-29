module.exports = function (req, res, next) {
  const id = req.params.id;
  if (id != req.user.id) {
    return res.status(403).send({
      message: "Faqat shaxsiy ma'lumotlarni ko'rishga ruxsat etiladi",
    });
  }

  next();
};
