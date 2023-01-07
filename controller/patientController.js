const patient = require('../Models/Database_Queries/patient_query')
const Title = require('../Models/Object_Models/Title')

exports.fetchPatient_Appointments_Using_User_ID = async(req, res) => {
    const result = await patient.fetchPatient_Appointments_Using_User_ID(req.params.id)
    console.log(result)
    res.render('Patient/Manage-Patients', { queriedPatients: result, layout: 'layouts/sub', Title: Title.TrackMe })
}


exports.fetchPatient_Appointments_Using_Patient_ID = async(req, res) => {
    const result = await patient.fetchPatient_Appointments_Using_Patient_ID(req.params.id)
    console.log(result)
    res.render('Patient/Appointments', { queriedAppointments: result, layout: 'layouts/sub', Title: Title.MyAppointments })
}