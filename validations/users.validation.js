const Joi = require("joi");

const userFullName = (parent) => {
  return parent.first_name + " " + parent.last_name;
};

exports.usersValidation = (body) => {
  const schemaUsers = Joi.object({
    username: Joi.string()
      .min(3)
      .message("username 3 ta harfdan kam bo'lmasin")
      .max(20)
      .message("username 20 ta harfdan uzun bo'lmasin")
      .required()
      .messages({
        "string.empty": "So'z bo'sh bo'lishi mumkin emas",
        "any.required": "So'zni kiriting",
      }),
    first_name: Joi.string(),
    last_name: Joi.string(),
    full_name: Joi.string().default(userFullName),
    email: Joi.string().email().lowercase(),
    password: Joi.string(),
    // .pattern(new RegExp("^[a-zA-Z0-9!$@#]{6, 30}$")),
    confirm_password: Joi.ref("password"),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    // image: Joi.string().default("/images/avatar.png"),
    is_active: Joi.boolean().default(false),
    role: Joi.string().valid("admin", "superadmin", "user"),
    activation_link: Joi.string(),
    refresh_token: Joi.string()
    // birth_date: Joi.date().less(new Date("2000-01-01")),
    // birth_year: Joi.number().integer().min(1980).max(2005),
    // referred: Joi.boolean().default(false),
    // referredDetails: Joi.string().when("referred", {
    //   is: true,
    //   then: Joi.string().required(),
    //   otherwise: Joi.string().optional(),
    // }),
    // coding_lang:Joi.array().items(Joi.string(), Joi.number()),
    // is_year:Joi.boolean().truthly("YES", "Ha").valid(true)
  });
  return schemaUsers.validate(body, {
    ebortEarly: false,
  });
};
