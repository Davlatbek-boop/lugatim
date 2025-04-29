const Joi = require("joi");

exports.wordsValidation = (body) => {
  const schemaWord = Joi.object({
    word: Joi.string()
      .min(1)
      .message("Soz' 1ta harifdan kam bo'lmaslik kerak")
      .max(100)
      .message("So'z 100ta harfdam ko'p bo'lamslik kerak")
      .required()
      .messages({
        "string.empty": "So'z bo'sh bo'lishi mumkin emas",
        "any.required": "So'zni kiriting",
      }),
  });
  return schemaWord.validate(body)
};
