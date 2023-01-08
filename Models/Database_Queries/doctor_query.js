const model = require('../sequelize_sequelizeModel')
const uuid = require('uuid')
const Sequelize = require('sequelize')


const age = Sequelize.fn(
    'TIMESTAMPDIFF',
    Sequelize.literal('YEAR'),
    Sequelize.literal('doctor_dateOfBirth'),
    Sequelize.fn('NOW')
);

exports.getOneDoctor = async function(doctor_ID) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [

            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%Y-%m-%d'), 'date2'],
            [Sequelize.col('doctor_schedule_start_time'), 'start'],
            [Sequelize.col('doctor_schedule_end_time'), 'end'],
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: { doctor_ID: doctor_ID }
    })
}
exports.getOneDoctor2 = async function(doctor_ID) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            [Sequelize.col('doctor_schedule_ID'), 'doctor_schedule_ID'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%Y/%m/%d'), 'date2'],
            [Sequelize.col('doctor_schedule_max_patient'), 'max'],
            [Sequelize.col('doctor_schedule_current_queue'), 'current'],
            [Sequelize.col('doctor_schedule_start_time'), 'start'],
            [Sequelize.col('doctor_schedule_end_time'), 'end'],
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }
        }],
        where: { doctor_ID: doctor_ID }
    })
}

exports.getDoctorUsing_ID = async function(doctor_ID) {
    return await model.doctor.findByPk(doctor_ID, {
        raw: true,
        attributes: [
            'doctor_first_name',
            'doctor_last_name', [Sequelize.col('specialization_Name'), 'specialization']
        ],
        include: [{
            model: model.doctor_specialization
        }]

    })

}

exports.getDoctor = async function() {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name', [age, 'doctor_age'],
            'doctor_gender',
            'doctor_room',
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name'],
            [Sequelize.col('specialization_Name'), 'specialization']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: [],
        }, {
            model: model.doctor_specialization,
        }],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        order: [
            ['doctor_first_name', 'DESC']
        ],
    })


}



exports.getSchedule = async function() {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],

        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }
        }],
    })
}
exports.getDoctor_Using_Spec_SubSpec_HMO = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room', [age, 'doctor_age'],
            'doctor_contact_number', [Sequelize.col('specialization_Name'), 'specialization'],
            [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name'],

        ],

        include: [{
            model: model.HMO,
            where: [{
                [Sequelize.Op.or]: [
                    { HMO_ID: searchOption.doctor_HMO },
                    { '$doctor.doctorSpecializationSpecializationID$': searchOption.Specialization }
                ]
            }]
        }, {
            model: model.doctor_specialization,
        }],

        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
    })

}

exports.getSchedule_Using_Spec_SubSpec_HMO = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
        ],

        include: [{
                model: model.HMO,
                where: [{
                    [Sequelize.Op.or]: [
                        { HMO_ID: searchOption.doctor_HMO },
                        { '$doctor.doctorSpecializationSpecializationID$': searchOption.Specialization }
                    ]
                }]
            }

        ],

        order: [
            ['doctor_first_name', 'DESC']
        ],

        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }
        }],

    })
}
exports.getDoctor_Using_All = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room', [age, 'doctor_age'],
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            where: [{
                [Sequelize.Op.and]: [
                    { HMO_ID: searchOption.doctor_HMO },
                    { '$doctor.doctorSpecializationSpecializationID$': searchOption.Specialization }
                ]
            }]
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],

        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${searchOption.Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${searchOption.Lname}%`,
                }
            }]
        }, ]

    })
}

exports.getSchedule_Using_All = async function(searchOption) {
    console.log(searchOption)
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
        ],
        include: [{
                model: model.HMO,
                where: [{
                    [Sequelize.Op.and]: [
                        { HMO_ID: searchOption.doctor_HMO },
                        { '$doctor.doctorSpecializationSpecializationID$': searchOption.Specialization }
                    ]
                }]
            }

        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],

        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${searchOption.Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${searchOption.Lname}%`,
                }
            }]
        }, ]
    })
}

exports.getDoctor_Using_Fname_Lname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room', [age, 'doctor_age'],
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: [],
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${searchOption.Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${searchOption.Lname}%`,
                }
            }]
        }, ]
    })
}

exports.getSchedule_Using_Fname_Lname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_first_name',
            'doctor_last_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${searchOption.Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${searchOption.Lname}%`,
                }
            }]
        }, ]
    })
}
exports.getDoctor_Using_Fname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room', [age, 'doctor_age'],
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: []
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            doctor_first_name: {
                [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
        }, ]
    })
}
exports.getSchedule_Using_Fname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_first_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],

        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            doctor_first_name: {
                [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
        }, ]
    })
}
exports.getDoctor_Using_Lname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room', [age, 'doctor_age'],
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: []
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            doctor_last_name: {
                [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
        }, ]
    })
}
exports.getSchedule_Using_Lname = async function(searchOption) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_last_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            doctor_last_name: {
                [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
        }, ]
    })
}

exports.getQueueInstance = async function(doctor_schedule_ID) {
    const instance = await model.doctor_schedule_table.findByPk(doctor_schedule_ID);
    return await instance.get('doctor_schedule_current_queue')
}

exports.incrementQueue = async function(doctor_schedule_ID) {
    await model.doctor_schedule_table.increment('doctor_schedule_current_queue', {
        returning: true,
        by: 1,
        where: { doctor_schedule_ID: doctor_schedule_ID }
    })
    await model.doctor_schedule_table.update({
        doctor_schedule_status: "Unavailable"
    }, {
        where: {
            doctor_schedule_ID: doctor_schedule_ID,
            doctor_schedule_max_patient: {
                [Sequelize.Op.lt]: Sequelize.col('doctor_schedule_current_queue')
            },
        }
    })
}


exports.selectDoctorAndSched = async function(doctor_ID) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_first_name',
            'doctor_last_name',
            'doctor_specialization',
            'doctor_HMO', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%W'), 'day'],
            [Sequelize.col('doctor_schedule_start_time'), 'start'],
            [Sequelize.col('doctor_schedule_end_time'), 'end'],

        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: []
        }],
    })
}