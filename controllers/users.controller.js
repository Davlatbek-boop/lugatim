const { errorHandler } = require("../helpers/error_handler");
const Users = require("../schemas/Users");
const { usersValidation } = require("../validations/users.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const jwtService = require("../services/jwt.service");

const addNewUser = async (req, res) => {
  try {
    const { error, value } = usersValidation(req.body);
    
    if (error) {
      return errorHandler(error, res);
    }

    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      role,
      is_active,
      phone,
    } = value;
    console.log(value);
    const hashedPassword = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();
    
    const newUser = await Users.create({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      is_active,
      phone,
      activation_link,
    });

    await mailService.sendActivationMail(
      newUser.email,
      `${config.get("api_url")}/api/users/activate/${activation_link}`
    );

    res
      .status(201)
      .send({
        message:
          "Yangi user qo'shildi.Akkauntni faollashtirish uchun pochtaga o'ting",
        newUser,
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Identifikatsiya jarayoni
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "Email yoki password noto‘g‘ri" });
    }

    // Autentifikatsiya jarayoni
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password noto‘g‘ri" });
    }

    // Payload yaratamiz
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Tokenlarni generatsiya qilamiz
    const tokens = jwtService.generateTokens(payload);
    // console.log(tokens);
    // Refresh tokenni bazaga saqlaymiz
    user.refresh_token = tokens.refreshToken;
    await user.save();

    // Cookie-ga refresh tokenni joylaymiz
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true, // HTTPS uchun
      sameSite: "Strict",
      maxAge: config.get("refresh_cookie_time"),
    });

    // Access tokenni jo‘natamiz
    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken
    });

  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async(req, res)=>{
  try{
    const {refreshToken} = req.cookies
    if (!refreshToken){
      return res.status(400).send({message: "Cookie refresh token topilmadi"})
    }
    const user = await Users.findOneAndUpdate(
      {refresh_token: refreshToken},
      {refresh_token: ""},
      {new: true}
    )
    if(!user){
      return res.status(400).send({message: "Bunday tokenli foydalanuvchi topilmadi"})
    }
    res.clearCookie("refreshToken");
    res.send({message: "User logged out", user})
  }catch(error){
    errorHandler(error, res)
  }
}


const getAllUsers = async (req, res) => { 
  try {
    const users = await Users.find({});
    if (!users) {
      return res.status(400).send({ message: "Birorta user topilmadi" });
    }
    res.status(201).send({ messaGE: "Succees", users });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(400).send({ message: "Birorta user topilmadi" });
    }
    res.status(201).send({ messaGE: "Succees", user });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await Users.findOne({ activation_link: req.params.link });
    if (!user) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    user.is_active = true;
    await Users.save();
    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: user.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenUser = async (req, res) => {
  try {
      const {refreshToken} = req.cookies;
      if (!refreshToken) {
          return res
              .status(400)
              .send({messege: "Cookieda refresh token topilmadi!"});
      }
      const decodedRefreshToken = await jwtService.verifyRefreshToken(refreshToken);
      const user = await Users.findOne({refresh_token: refreshToken})
      if (!user) {
          return res
              .status(400)
              .send({messege: "Bunday tokenli foydalanuvchi topilmadi!"});
      }

      const payload = {
          id: user._id,
          email: user.email,
          role: user.role
      }

      const tokens = jwtService.generateTokens(payload)
      user.refresh_token = tokens.refreshToken;
      await user.save();

      res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: config.get("refresh_cookie_time")
      });
      res.send({
          messege: "Tokenlar yangilandi!", 
          accessToken: tokens.accessToken
      });
  } catch (error) {
      errorHandler(error, res);
  }
}


module.exports = {
  addNewUser,
  loginUser,
  getAllUsers,
  getUserById,
  activateUser,
  refreshTokenUser,
  logoutUser,
};
