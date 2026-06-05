const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

router.get("/register", (req,res) => {
    res.render("users/register");
});

router.post("/register", async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password:hashedPassword});
        await newUser.save();
        console.log("User registered successfully");
        res.redirect("/login");
    } catch(err) {
        console.log(err);
        res.send("Error registering user");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", async(req, res) => {
    try {
        const {username, password} = req.body;
        const foundUser = await User.findOne({username});
        if(!foundUser) {
            return res.send("User Not Found");
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch) {
            return res.send("Invalid Password");
        }
        req.session.userId = foundUser._id;
        req.session.username = foundUser.username;
        res.redirect("/dashboard");
    } catch(err) {
        console.log(err);
        res.send("Something went wrong");
    }
});

router.get("/dashboard", (req, res) => {
    if(!req.session.userId) {
        return res.redirect("/login");
    }
    res.render("users/dashboard", {
        username: req.session.username
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;