const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error_handler");
const { adminValidation } = require("../validations/admin.validation");
const JwtService = require("../services/jwt.service");
const config = require("config");
const mailService = require("../services/mail.service");
const Admins = require("../models/admins.model");
// const Otp = require("../models/OTP.model");
// const uuid = require('uuid'); 

const jwtService = new JwtService(
  config.get("creator_access_key"),
  config.get("creator_refresh_key"),
  config.get("creator_access_time"),
  config.get("creator_refresh_time")
);

const addCreator = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const { user_name, last_name, email, password, phone, profile_photo } =
      value;

    const existingUser = await Admins.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .send({ error: "This email is already registered." });
    }

    const hash_password = bcrypt.hashSync(password, 7);

    const newCreator = await Admins.create({
      user_name,
      last_name,
      email,
      hash_password,
      phone,
      photo: profile_photo,
      is_creator: true
    });

    const payload = {
      username: newCreator.user_name,
      email: newCreator.email,
      is_creator: newCreator.is_creator,
    };

    const tokens = jwtService.generateTokens(payload);

    newCreator.refresh_token = tokens.refreshToken;
    await newCreator.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(201).send({
      message: "Creator added",
      newCreator,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginCreator = async (req, res) => {
  try {
    const { email, password } = req.body;

    const creator = await Admins.findOne({ where: { email } });

    if (!creator) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }

    if(!creator.is_creator){
      return res.status(400).send({ message: "siz shunchaki adminsiz o'rninggizni biling" });
    }

    const validPassword = bcrypt.compareSync(password, creator.hash_password);

    if (!validPassword) {
      return res.status(400).send({ message: "email yoki password noto'g'ri" });
    }

    const payload = {
      username: creator.user_name,
      email: creator.email,
      is_creator: creator.is_creator,
    };

    const tokens = jwtService.generateTokens(payload);

    creator.refresh_token = tokens.refreshToken;
    await creator.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true, // faqat server orqali o'qish mumkin
      maxAge: config.get("refresh_cookie_time"), // cookie o'zini vaqti
    });

    res.send({
      message: "Tizimga xush kelibsiz Creator",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutCreator = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }

    const creator = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });


    if (!creator) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    creator.refresh_token = "";
    await creator.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Creator logged out", creator: creator.user_name });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenCreator = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token topilmadi" });
    }
    const creator = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!creator) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: creator.id,
      number: creator.phone_number,
      is_creator: creator.is_creator,
    };

    const tokens = jwtService.generateTokens(payload);

    creator.refresh_token = tokens.refreshToken;
    await creator.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true, // faqat server orqali o'qish mumkin
      maxAge: config.get("refresh_cookie_time"), // cookie o'zini vaqti
    });

    res.send({
      message: "Refresh token yangilandi Creator",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCreators = async (req, res) => {
  try {
    const creators = await Admins.findAll({where: { is_creator: true}});
    res.status(200).send({ creators });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCreatorById = async (req, res) => {
  try {
    const id = req.params.id;
    const creator = await Admins.findByPk(id);
    res.status(200).send({ creator });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCreatorById = async (req, res) => {
  try {
    const id = req.params.id;

    const { user_name, last_name, email, phone, profile_photo } = req.body;

    const creator = await Admins.update(
      { user_name, last_name, email, phone, photo: profile_photo },
      { where: { id }, returning: true }
    );
    res.status(200).send({ creator: creator[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCreatorById = async (req, res) => {
  try {
    const id = req.params.id;
    const creator = await Admins.destroy({ where: { id } });
    res.status(200).send({ creator });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCreator,
  getAllCreators,
  getCreatorById,
  updateCreatorById,
  deleteCreatorById,
  loginCreator,
  logoutCreator,
  refreshTokenCreator,
};
