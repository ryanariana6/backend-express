const express = require('express');
const {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = require('../controllers/Admin.js');
// import { verifyAdmin, adminOnly} from "../middleware/AuthAdmin.js";


const router = express.Router();

router.get('/admins', getAdmins);
router.get('/admins/:id', getAdminById);
router.post('/admins',  createAdmin);
router.patch('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;