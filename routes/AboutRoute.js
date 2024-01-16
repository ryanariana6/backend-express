const express = require('express');
const aboutsController = require('../controllers/Abouts.js');

const {
    getAbouts,
    getAboutById,
    createAbout,
    updateAbout,
    deleteAbout
} = aboutsController;
// import { verifyAdmin } from "../middleware/AuthAdmin.js";

const router = express.Router();

router.get('/abouts',  getAbouts);
router.get('/abouts/:id',  getAboutById);
router.post('/abouts', createAbout);
router.patch('/abouts/:id', updateAbout);
router.delete('/abouts/:id', deleteAbout);

module.exports = router;