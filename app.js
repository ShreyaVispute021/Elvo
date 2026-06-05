const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
// const MongoStore = require("connect-mongo");
const app = express();

const userRouter = require("./routes/user");
const investmentRouter = require("./routes/investment");

main().then(() => console.log("Database Connected")).catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/elvo")
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "elvoSecretKey",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //     mongoUrl: "mongodb://127.0.0.1:27017/elvo"
    // }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.username;
    next();
});

app.use("/", userRouter);
app.use("/", investmentRouter);

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});