const express = require('express');
const servicesController = require('../controllers/Services.js');

const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = servicesController;


const router = express.Router();

router.get('/services', getServices);
router.get('/services/:id', getServiceById);
router.post('/services', createService);
router.patch('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router;