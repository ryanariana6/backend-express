import Admin from "../models/AdminModel.js";

export const verifyAdmin = async (req, res, next) =>{
    if(!req.session.adminId){
        return res.status(401).json({msg: "mohon login ke akun anda"});
    }
    const admin = await Admin.findOne({
        where: {
            uuid: req.session.adminId
        }
    });
    if(!admin) return res.status(404).json({msg:"ID tidak ditemukan"});
    req.adminId = admin.id;
    req.role = admin.role;
    next();
}

export const adminOnly = async (req, res, next) =>{
    const admin = await Admin.findOne({
        where: {
            uuid: req.session.adminId
        }
    });
    if(!admin) return res.status(404).json({msg:"ID tidak ditemukan"});
    if(admin.role !== "admin") return res.status(403).json({msg:"akses terlarang"});
    next();
}