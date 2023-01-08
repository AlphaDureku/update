const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')
const { use } = require('../../Routes')


exports.findAdmin = async function(username) {
    return await model.doctor_Secretary.findOne({
        raw: true,
        where: {
            doctor_Secretary_username: username
        }
    })
}

exports.findAdminUsingID = async function(sec_ID) {
    return await model.doctor_Secretary.findOne({
        raw: true,
        where: {
            doctor_Secretary_ID: sec_ID
        }
    })
}