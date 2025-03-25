const { errorHandler } = require("../helpers/error_handler");
const Words = require("../schemas/Words");
const { default: mongoose } = require("mongoose");
const { wordsValidation } = require("../validations/words.validation");

const addNewWord = async (req, res) => {
  try {
    
    const {error, value} = wordsValidation(req.body)
    
    if(error){
      return errorHandler(error, res)
    }

    const {word} = value
    const newWord = await Words.create({
      word,
      letter: word[0].toUpperCase(),
    });

    res.status(201).send({ message: "Yangi so'z qo'shildi", newWord });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllWords = async (req, res) => {
  try {
    const words = await Words.find({});
    res.send({ words });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteWordById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectID" });
    }
    const word = await Words.findByIdAndDelete({ _id: id });

    res.send({ word });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getWordsByWord = async (req, res) => {
  try {
    const searchWord = req.query.w;
    const allwords = await Words.find({ word: new RegExp(searchWord, "i") });
    res.send({ allwords });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewWord,
  getAllWords,
  deleteWordById,
  getWordsByWord,
};
