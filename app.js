require("dotenv").config();

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { MongoStore } = require("connect-mongo");
const app = express();

const userRouter = require("./routes/user");
const investmentRouter = require("./routes/investment");
const watchlistRoutes = require("./routes/watchlist");
const stockRoutes = require("./routes/stocks");

main().then(() => console.log("Database Connected")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URL);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);
app.use(compression());
app.use(morgan("dev"));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.username;
    next();
});

app.use("/", userRouter);
app.use("/", investmentRouter);
app.use("/", watchlistRoutes);
app.use("/", stockRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.use((req, res) => {
    res.status(404).render("error", {
        message: "Page Not Found"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render("error", {
        message: err.message || "Something went wrong"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});