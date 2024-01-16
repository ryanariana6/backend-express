const Admin = require('../models/AdminModel.js');
const argon2 = require('argon2');

async function Login(req, res){
    const admin = await Admin.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!admin) return res.status(404).json({msg:"ID tidak ditemukan"});
    const match = await argon2.verify(admin.password, req.body.password);
    if(!match) return res.status(404).json({msg:"Wrong password"});
    req.session.adminId = admin.uuid;
    const uuid = admin.uuid;
    const name = admin.name;
    const email = admin.email;
    const role = admin.role;
    res.status(200).json({uuid, name, email, role});
}
async function Me(req, res){
    if(!req.session.adminId){
        return res.status(401).json({msg: "mohon login ke akun anda"});
    }
    const admin = await Admin.findOne({
        attributes: ['uuid', 'name','email','role'],
        where: {
            uuid: req.session.adminId
        }
    });
    if(!admin) return res.status(404).json({msg:"ID tidak ditemukan"});
    res.status(200).json(admin);
}

async function logOut(req, res){
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak dapat LogOut"});
        res.status(200).json({msg: "anda telah LOGOUT"});
    });
}

module.exports = {
    Login,
    Me,
    logOut,
}