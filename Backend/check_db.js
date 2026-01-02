const mongoose = require('mongoose');
const rideModel = require('./models/ride.model');
const userModel = require('./models/user.model');
require('dotenv').config();

async function checkRides() {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('Connected to DB');

    const rides = await rideModel.find({});
    console.log(`Total rides: ${rides.length}`);
    
    if (rides.length > 0) {
        console.log('Sample rides:');
        rides.forEach(r => {
            console.log(`ID: ${r._id}, User: ${r.user}, Status: ${r.status}, Fare: ${r.fare}`);
        });
    } else {
        console.log('No rides found.');
    }

    const users = await userModel.find({});
    console.log(`Total users: ${users.length}`);
    users.forEach(u => {
        console.log(`User ID: ${u._id}, Name: ${u.fullname.firstname}`);
    });

    mongoose.disconnect();
}

checkRides();