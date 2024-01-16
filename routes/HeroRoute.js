const express = require('express');
const herosController = require('../controllers/Heros.js');

const {
    getHeros,
    getHeroById,
    createHero,
    updateHero,
    deleteHero
} = herosController;


const router = express.Router();

router.get('/heros', getHeros);
router.get('/heros/:id', getHeroById);
router.post('/heros', createHero);
router.patch('/heros/:id', updateHero);
router.delete('/heros/:id', deleteHero);

module.exports = router;