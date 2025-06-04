// const express = require('express');
const authController = require("../controller/auth/authController");
const { isAdmin, isUser,verifyToken } = require('../middleware/verifyAuth');


// const router = express.Router();

// router.get('/users', getUsers);

const authRoutes = (router) => {
    router.post('/register', authController.Register);
    router.post('/login', authController.login);
    // router.patch('/reset',resetPassword);
    // router.get('/profile', verifyToken, getProfile);
    // router.patch('/profile',verifyToken,updateProfile)

}


module.exports = { authRoutes };