const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, vehicleModel
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType || !vehicleModel) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
            model: vehicleModel
        },
        location: {
            type: 'Point',
            coordinates: [0, 0]
        }
    })

    return captain;
}