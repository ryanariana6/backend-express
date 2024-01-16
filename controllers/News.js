const News = require('../models/NewsModels.js');
const Admin = require('../models/AdminModel.js');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function getNews(req, res){
    try {
        let response;
        if(req.role === "admin"){
            response = await News.findAll({
                attributes:['uuid','name','image','ket','url'],
                include:[{
                    model: Admin
                }]
            });
        }else{
            response = await News.findAll({
                attributes:['uuid','name','image','ket','url'],
                where:{
                    adminId: req.session.adminId
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
async function getNewById(req, res){
    try {
        const news = await News.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!news) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await News.findOne({
                attributes:['uuid','name','image','ket','url'],
                where:{
                    id: news.id
                },
                include:[{
                    model: Admin
                }]
            });
        }else{
            response = await News.findOne({
                attributes:['uuid','name','image','ket','url'],
                where:{
                    [Op.and]:[{id: news.id}, {adminId: req.adminId}]
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
async function createNew(req, res){
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.title;
    const file = req.files.file;
    const keterangan = req.body.ket;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/imgNews/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    console.log(req)

    file.mv(`./public/images/imgNews/${fileName}`, async (err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await News.create({
                name: name,
                image: fileName,
                ket: keterangan,
                url: url,
                adminId: req.adminId
            });
            res.status(201).json({msg: "NEWS Created Successfuly"});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    })
}
async function updateNew(req, res){
    const news = await News.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!news) return res.status(404).json({msg: "no Data found"});
    let nama = "";
    let fileName = "";
    let kete = "";
    if(req.title===null){
        nama = News.name;
        kete = News.ket;
    }
    if(req.files === null){
        fileName = News.image;
        kete = News.ket;
        // jika image kosong ID ADMIN upldate title tanpa update imagenya
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/imgNews/${news.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/imgNews/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message})
        });
    }
    const name = req.body.title;
    const keterangan = req.body.ket;
    const url = `${req.protocol}://${req.get("host")}/images/imgNews/${fileName}`;
    try {
        await News.update({name: name, image: fileName, ket: keterangan, url: url},{
            where: {
                [Op.and]:[{id: news.id}, {adminId: req.adminId}]
            }
        });
        res.status(200).json({msg: "NEWS updated successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
async function deleteNew(req, res){
    const news = await News.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!news) return res.status(404).json({msg: "no Data found"});
    try {
        const filepath = `./public/images/imgNews/${news.image}`;
        fs.unlinkSync(filepath);
        await News.destroy({
            where: {
                id : req.params.id
            }
        });
        if(req.role === "admin"){
            await News.destroy({
                where:{
                    id: news.id
                }
            });
        }else{
            if(req.adminId !== news.adminId) return res.status(403).json({msg: "Akses terlarang"});
            await News.destroy({
                where:{
                    [Op.and]:[{id: news.id}, {adminId: req.adminId}]
                }
            });
        }
        res.status(200).json({msg: "NEWS deleted successfully"});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    deleteNew,
    getNews,
    getNewById,
    createNew,
    updateNew
}