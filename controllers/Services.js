const Service = require('../models/LayananModel.js');
const Admin = require('../models/AdminModel.js');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function getServices(req, res){
    
    try {
        let response;
        if(req.role === "admin"){
            response = await Service.findAll({
                attributes:['uuid','name','image','ketser','url'],
                include:[{
                    model: Admin,
                    attributes:['name','image','ketser','url']
                }]
            });
        }else{
            response = await Service.findAll({
                attributes:['uuid','name','image','ketser','url'],
                where:{
                    adminId: req.adminId
                },
                include:[{
                    model: Admin,
                    attributes:['name','image','ketser','url']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function getServiceById(req, res){
    
    try {
        const service = await Service.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!service) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Service.findOne({
                attributes:['uuid','name','image','ketser','url'],
                where:{
                    id: service.id
                },
                include:[{
                    model: Admin,
                    attributes:['name','image','ketser','url']
                }]
            });
        }else{
            response = await Service.findOne({
                attributes:['uuid','name','image','ketser','url'],
                where:{
                    [Op.and]:[{id: service.id}, {adminId: req.adminId}]
                },
                include:[{
                    model: Admin,
                    attributes:['name','image','ketser','url']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function createService(req, res){
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.title;
    const file = req.files.file;
    const keterangan = req.body.ketser;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/imgService/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/imgService/${fileName}`, async (err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Service.create({
                name: name,
                image: fileName,
                ketser: keterangan,
                url: url,
                adminId: req.adminId
            });
            res.status(201).json({msg: "Services Created Successfuly"});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    })
}
async function updateService(req, res){
    const service = await Service.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!service) return res.status(404).json({msg: "no Data found"});
    let nama = "";
    let fileName = "";
    let kete = "";
    if(req.title===null){
        nama = Service.name;
        kete = Service.ketser;
    }
    if(req.files === null){
        fileName = Service.image;
        kete = Service.ketser;
        // jika image kosong ID ADMIN upldate title tanpa update imagenya
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/imgService/${service.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/imgService/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message})
        });
    }
    const name = req.body.title;
    const keterangan = req.body.ketser;
    const url = `${req.protocol}://${req.get("host")}/images/imgService/${fileName}`;
    try {
        await Service.update({name: name, image: fileName, ketser: keterangan, url: url},{
            where: {
                [Op.and]:[{id: service.id}, {adminId: req.adminId}]
            }
        });
        res.status(200).json({msg: "Service updated successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
async function deleteService(req, res){
    const service = await Service.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!service) return res.status(404).json({msg: "no Data found"});
    try {
        const filepath = `./public/images/imgService/${service.image}`;
        fs.unlinkSync(filepath);
        await Service.destroy({
            where: {
                id : req.params.id
            }
        });
        if(req.role === "admin"){
            await Service.destroy({
                where:{
                    id: service.id
                }
            });
        }else{
            if(req.adminId !== service.adminId) return res.status(403).json({msg: "Akses terlarang"});
            await Service.destroy({
                where:{
                    [Op.and]:[{id: service.id}, {adminId: req.adminId}]
                }
            });
        }
        res.status(200).json({msg: "Service deleted successfully"});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
}