const express = require("express");
const mongoose = require("mongoose"); //ODM - object document mapper
const config = require("config"); // o'zgaruvchilar muhitidan o'qish
const mainRouter = require("./routes/index.routes");
const errorHandling = require("./middleware/errors/error.handling");
const cookieParser = require("cookie-parser"); //cookie malumotlarini obyect ko'rinishida chaqirib beradi
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");

const PORT = config.get("port") || 3030;

const app = express();
app.use(cookieParser());
app.use(express.json());

//
const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

app.use("/", viewRouter);
app.use("/api", mainRouter);

app.use(errorHandling); // doim eng oxiriga yozish kerak
async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Ma'lumotlar bazasiga ulanishda xatolik");
  }
}

start();
