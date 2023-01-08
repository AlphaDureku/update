const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const insert = require('../Models/Database_Queries/insert_query')
const patient = require('../Models/Database_Queries/patient_query')
const admin = require('../Models/Database_Queries/admin_query')
const bcrypt = require('bcrypt')

exports.test = async(req, res) => {

    res.render('Secretary/login', { layout: 'layouts/secretary_layout' })
}


exports.dashboard = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    console.log(result)
    res.send(result)
}


exports.login = async(req, res) => {
    try {
        const result = await admin.findAdmin(req.body.username)
            // const salt = await bcrypt.genSalt()
            // const hashedPassword = await bcrypt.hash(req.body.password, salt)
        if (result == null) {
            res.send('Wrong username or password')
        }

        if (await bcrypt.compare(req.body.password, result.doctor_Secretary_password)) {
            req.session.sec_ID = result.doctor_Secretary_ID
            res.redirect('dashboard')
        } else {
            res.send('Wrong username or password')
        }
    } catch (error) {
        console.log(error)
    }
}


exports.insertAdmin = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash('1234', salt)
        let adminModel = {
            username: 'Mark',
            password: hashedPassword
        }
        insert.insertAdmin(adminModel)
    } catch (error) {
        console.log(error)
    }
}