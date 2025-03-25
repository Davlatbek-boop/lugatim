const { createViewPage } = require("../helpers/create.view.page");

const router = require("express").Router();

router.get("/", (req, res)=>{
    res.render(createViewPage("index"),{
        title: "Asosiy sahifa",
        mainPage: true
    })
})

router.get("/words", (req, res)=>{
    res.render(createViewPage("words"),{
        title: "Words sahifasi",
        wordsPage: true
    })
})

router.get("/language", (req, res)=>{
    res.render(createViewPage("language"),{
        title: "Language sahifasi",
        languagePage: true
    })
})

router.get("/login", (req, res)=>{
    res.render(createViewPage("login"),{
        title: "Login sahifasi",
        loginPage: true
    })
})

router.get("/user", (req, res)=>{
    res.render(createViewPage("user"),{
        title: "user sahifasi",
        userPage: true
    })
})

module.exports = router