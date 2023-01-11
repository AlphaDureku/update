const mail = require('nodemailer')
const doctor = require('../Models/Database_Queries/doctor_query')
const insert = require('../Models/Database_Queries/insert_query')
const patient = require('../Models/Database_Queries/patient_query')
const admin = require('../Models/Database_Queries/admin_query')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { param } = require('../Routes')


exports.test = async(req, res) => {

    res.render('Secretary/login', { layout: 'layouts/secretary_layout' })
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
            res.send('success')
        } else {
            res.send('Wrong username or password')
        }
    } catch (error) {
        console.log(error)
    }
}

exports.dashboard = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    console.log(doctorList)
    if (doctorList.length != 0) {
        req.session.doctor_ID = doctorList[0].doctor_ID
    } else {
        req.session.doctor_ID = null;
    }
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.session.doctor_ID, startOfDay, endOfDay)

    res.render('Secretary/dashboard', {
        adminInfo: result,
        doctors: doctorList,
        appointments: patientAppointments,
        selection: '',
        layout: 'layouts/secretary_dashboard_layout',
        doctor_IDselect: req.session.doctor_ID
    })
}

exports.dashboardOnChange = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();
    console.log(req.query.value)
    let options = {
        Day: '',
        Week: '',
        Month: '',
        Year: ''
    }
    doctor_IDselect = req.query.doctor_ID
    req.session.doctor_ID = req.query.doctor_ID
    if (req.query.nameQuery) {
        console.log('executed with name')
        if (req.query.value == 'thisDay') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfDay, endOfDay, req.query.nameQuery)
            options.Day = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisWeek') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfWeek, endOfWeek, req.query.nameQuery)
            options.Week = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisMonth') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfMonth, endOfMonth, req.query.nameQuery)
            options.Month = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else {
            const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfYear, endOfYear, req.query.nameQuery)
            options.Year = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        }
    } else {
        console.log('noname')
        if (req.query.value == 'thisDay') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfDay, endOfDay)
            options.Day = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisWeek') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfWeek, endOfWeek)
            options.Week = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else if (req.query.value == 'thisMonth') {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfMonth, endOfMonth)
            options.Month = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        } else {
            const patientAppointments = await doctor.fetchDoctorPatientAppointments(req.query.doctor_ID, startOfYear, endOfYear)
            options.Year = 'selected'
            res.render('Secretary/dashboard', { doctor_IDselect, doctors: doctorList, adminInfo: result, appointments: patientAppointments, selection: options, layout: 'layouts/secretary_dashboard_layout' })
        }
    }
}

exports.manageAppointments = async(req, res) => {
    const doctorList = await admin.findDoctors(req.session.sec_ID)
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();


    if (req.query.doctor_ID) {
        doctor_IDselect = req.query.doctor_ID
        req.session.doctor_ID = req.query.doctor_ID
    } else if (doctorList[0].doctor_ID != undefined) {
        doctor_IDselect = doctorList[0].doctor_ID
    } else {
        doctor_IDselect = ''
    }

    if (req.query.nameQuery) {
        const patientAppointments = await doctor.fetchDoctorPatientAppointmentsWithName(req.query.doctor_ID, startOfYear, endOfYear, req.query.nameQuery)
        res.render('Secretary/manageAppointments', { doctor_IDselect, doctors: doctorList, appointments: patientAppointments, adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
    } else {
        const patientAppointments = await doctor.fetchDoctorPatientAppointments(doctor_IDselect, startOfYear, endOfYear)
        res.render('Secretary/manageAppointments', { doctor_IDselect, doctors: doctorList, appointments: patientAppointments, adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
    }
}


exports.manageProfile = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/manageProfile', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateProfile = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/updateProfile', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateProfilePost = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    let status = {
        Fname: true,
        Mname: true,
        Lname: true
    }
    const params = {
        ID: req.session.sec_ID,
        Fname: req.body.Fname,
        Mname: req.body.Mname,
        Lname: req.body.Lname
    }
    if (params.Fname == result.doctor_Secretary_first_name) {
        status.Fname = false
    }
    if (params.Lname == result.doctor_Secretary_last_name) {
        status.Lname = false
    }
    if (params.Mname == result.doctor_Secretary_middle_name) {
        status.Mname = false
    }
    if (status.Fname && status.Mname && status.Lname) {
        await admin.updateProfile(params)
    }
    console.log(params)

    res.send(status)

}
exports.updateSecurity = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    res.render('Secretary/updateSecurity', { adminInfo: result, layout: 'layouts/secretary_dashboard_layout' })
}
exports.updateSecurityPost = async(req, res) => {
    const result = await admin.findAdminUsingID(req.session.sec_ID)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
    const params = {
        doctor_Secretary_ID: req.session.sec_ID,
        password: hashedPassword,
        newPassword: req.body.newPassword,
        retypePassword: req.body.retypePassword
    }
    console.log(params)
    const status = {
        isAuthorized: false,
        isSame: false
    }
    if (await bcrypt.compare(req.body.currentPassword, result.doctor_Secretary_password)) {
        status.isAuthorized = true
        if (params.newPassword == params.retypePassword) {
            status.isSame = true
            console.log('success')
            await admin.updatePassword(params)
            res.send(status)
        } else {
            res.send(status)
        }
    } else {
        res.send(status)
    }
}

exports.renderSchedule = async(req, res) => {
    const result = await doctor.getOneDoctor(req.session.doctor_ID)
    res.send(result)
}



exports.insertAdmin = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash('1234', salt)
        let adminModel = {
            username: 'mark',
            password: hashedPassword,
            Fname: 'Mark Angelo',
            Lname: 'Templanza',
        }
        insert.insertAdmin(adminModel)
    } catch (error) {
        console.log(error)
    }
}

exports.insertDoctorAvailability = async(req, res) => {
    const scheduleParams = {
        doctor_ID: req.session.doctor_ID,
        maxPatient: req.body.maxPatient,
        date: req.body.dateSelected,
        start: req.body.startTime,
        end: req.body.endTime,
    }
    insert.insertDoctorAvailability(scheduleParams)
    res.redirect('dashboard')
}

exports.updateAppointment = async(req, res) => {
    const params = {
        ID: req.body.appointment_ID,
        status: req.body.status
    }
    await admin.updateAppointment(params)
    const contact = await admin.getContactUsingApp_ID(params.ID)
    console.log(contact)
    res.redirect('dashboard')
}