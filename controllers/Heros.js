const Hero = require('../models/HeroModel.js');
const Admin = require('../models/AdminModel.js');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function getHeros(req, res){
    try {
        let response;
        if(req.role === "admin"){
            response = await Hero.findAll({
                attributes:['uuid','name','image','kether','url'],
                include:[{
                    model: Admin
                }]
            });
        }else{
            response = await Hero.findAll({
                attributes:['uuid','name','image','kether','url'],
                where:{
                    adminId: req.adminId
                },
                include:[{
                    model: Admin
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function getHeroById(req, res){
    try {
        const hero = await Hero.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!hero) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Hero.findOne({
                attributes:['uuid','name','image','kether','url'],
                where:{
                    id: hero.id
                },
                include:[{
                    model: Admin
                }]
            });
        }else{
            response = await Hero.findOne({
                attributes:['uuid','name','image','kether','url'],
                where:{
                    [Op.and]:[{id: hero.id}, {adminUuid: req.adminUuid}]
                },
                include:[{
                    model: Admin
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function createHero(req, res){
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.title;
    const file = req.files.file;
    const keterangan = req.body.kether;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/imgHero/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    console.log(req)

    file.mv(`./public/images/imgHero/${fileName}`, async (err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Hero.create({
                name: name,
                image: fileName,
                kether: keterangan,
                url: url,
                adminId: req.adminId
            });
            res.status(201).json({msg: "Hero Created Successfuly"});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    })
}
async function updateHero(req, res){
    const hero = await Hero.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!hero) return res.status(404).json({msg: "no Data found"});
    let nama = "";
    let fileName = "";
    let kete = "";
    if(req.title===null){
        nama = Hero.name;
        kete = Hero.kether;
    }
    if(req.files === null){
        fileName = Hero.image;
        kete = Hero.kether;
        // jika image kosong ID Admin upldate title tanpa update imagenya
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/imgHero/${hero.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/imgHero/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message})
        });
    }
    const name = req.body.title;
    const keterangan = req.body.kether;
    const url = `${req.protocol}://${req.get("host")}/images/imgHero/${fileName}`;
    try {
        await Hero.update({name: name, image: fileName, kether: keterangan, url: url},{
            where: {
                [Op.and]:[{id: hero.id}, {adminId: req.adminId}]
            }
        });
        res.status(200).json({msg: "Hero updated successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
async function deleteHero(req, res){
    const hero = await Hero.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!hero) return res.status(404).json({msg: "no Data found"});
    try {
        const filepath = `./public/images/imgHero/${hero.image}`;
        fs.unlinkSync(filepath);
        await Hero.destroy({
            where: {
                id : req.params.id
            }
        });
        if(req.role === "admin"){
            await Hero.destroy({
                where:{
                    id: hero.id
                }
            });
        }else{
            if(req.adminId !== hero.adminUuid) return res.status(403).json({msg: "Akses terlarang"});
            await Hero.destroy({
                where:{
                    [Op.and]:[{id: hero.id}, {adminId: req.adminId}]
                }
            });
        }
        res.status(200).json({msg: "Hero deleted successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    getHeros,
    getHeroById,
    createHero,
    updateHero,
    deleteHero
}