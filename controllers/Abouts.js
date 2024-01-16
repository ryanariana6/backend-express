const Admin = require('../models/AdminModel.js');
const About = require('../models/AboutModel.js');
const { Op } = require('sequelize');

async function getAbouts(req, res){
    
    try {
        let response;
        if(req.role === "admin"){
            response = await About.findAll({
                attributes:['uuid', 'history','vision','mision','values'],
                include:[{
                    model: Admin,
                    attributes:['history','vision','mision','values']
                }]
            });
        }else{
            response = await About.findAll({
                attributes:['uuid', 'history','vision','mision','values'],
                where:{
                    adminId: req.adminId
                },
                include:[{
                    model: Admin,
                    attributes:['history','vision','mision','values']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function getAboutById(req, res){
    
    try {
        const about = await About.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!about) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await About.findOne({
                attributes:['uuid', 'history','vision','mision','values'],
                where:{
                    id: about.id
                },
                include:[{
                    model: Admin,
                    attributes:['history','vision','mision','values']
                }]
            });
        }else{
            response = await About.findOne({
                attributes:['uuid', 'history','vision','mision','values'],
                where:{
                    [Op.and]:[{id: about.id}, {adminId: req.adminId}]
                },
                include:[{
                    model: Admin,
                    attributes:['history','vision','mision','values']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
async function createAbout(req, res){
    const {history, vision, mision, values} = req.body;
    try {
        await About.create({
            history: history,
            vision: vision,
            mision: mision,
            values: values,
            adminId: req.adminId
        });
        res.status(201).json({msg: "Upload successfully"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
async function updateAbout(req, res){
    
    try {
        const about = await About.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!about) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {history, vision, mision, values} = req.body;
        if(req.role === "admin"){
            await About.update({history, vision, mision, values},{
                where:{
                    id: about.id
                }
            });
        }else{
            if(req.adminId !== about.adminId) return res.status(403).json({msg: "Akses terlarang"});
            await Product.update({history, vision, mision, values},{
                where:{
                    [Op.and]:[{id: about.id}, {
                        adminId: req.adminId
                    }]
                }
            });
        }
        res.status(200).json({msg: "Updated Successfully"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
async function deleteAbout(req, res){
    
    try {
        const about = await About.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {history, vision, mision, values} = req.body;
        if(req.role === "admin"){
            await About.destroy({
                where:{
                    id: about.id
                }
            });
        }else{
            if(req.adminId !== about.adminId) return res.status(403).json({msg: "Akses terlarang"});
            await About.destroy({
                where:{
                    [Op.and]:[{id: about.id}, {adminId: req.adminId}]
                }
            });
        }
        res.status(200).json({msg: "About Delete"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

module.exports = {
    getAbouts,
    getAboutById,
    updateAbout,
    createAbout,
    deleteAbout
}