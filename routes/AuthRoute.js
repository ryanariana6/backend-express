const express = require('express');
const authController = require('../controllers/Auth.js');

const {
    Login,
    logOut,
    Me
} = authController;

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logOut);


module.exports = {
    router
}