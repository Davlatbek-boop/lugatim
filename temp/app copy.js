const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const mainRouter = require("../routes/index.routes");
const errorHandling = require("../middleware/errors/error.handling");
const winston = require("winston")
const responses = require("../middleware/loggers/request.logger")
const resError = require("../middleware/loggers/request.error.logger");
const exHbs = require('express-handlebars');


require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
}) 



const PORT = config.get("port") || 3030;


// console.log(process.env.secret)
// console.log(process.env.NODE_ENV)
// console.log(config.get("secret"));




//EventEmitter 
// process.on("uncaughtException", (exception)=>{
//   console.log("uncaughtException:", exception.message);
// })

// process.on("uncaughtException", (rejection)=>{
//   console.log("uncaughtException:", rejection);
// })


const logger = require("../services/logger.service");

// logger.log("info","LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlari");
// logger.debug("DEBUG ma'lumotlari");
// logger.warn("WARN ma'lumotlari");
// logger.info("INFO ma'lumotlari");
// console.trace("TRACE ma'lumotlari");
// console.table([1,2,3]);
// console.table([["ali", 22],["ali", 22],["ali", 22]]);


const app = express();
app.use(responses)

app.use(express.json())

app.use("/api", mainRouter)

app.use(resError);

app.use(errorHandling)// doim eng oxiriga yozish kerak
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