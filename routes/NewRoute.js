const express = require('express');
const {
    getNews,
    getNewById,
    createNew,
    updateNew,
    deleteNew
} = require('../controllers/News.js');
//import { verifyAdmin, adminOnly } from "../middleware/AuthAdmin.js";


const router = express.Router();

router.get('/news', getNews);
router.get('/news/:id', getNewById);
router.post('/news', createNew);
router.patch('/news/:id', updateNew);
router.delete('/news/:id', deleteNew);

module.exports = router;