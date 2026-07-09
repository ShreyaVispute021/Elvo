const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const { isLoggedIn } =
    require("../middleware");

router
    .route("/register")
    .get(userController.showRegister)
    .post(userController.register);

router
    .route("/login")
    .get(userController.showLogin)
    .post(userController.login);

router.get(
    "/dashboard",
    isLoggedIn,
    userController.dashboard
);

router.get(
    "/logout",
    userController.logout
);

module.exports = router;