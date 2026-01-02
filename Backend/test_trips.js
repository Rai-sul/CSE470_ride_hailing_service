const axios = require('axios');
const userModel = require('./models/user.model');
const mongoose = require('mongoose');
require('dotenv').config();

async function testUserTrips() {
    await mongoose.connect(process.env.DB_CONNECT);
    
    // Get a user
    const user = await userModel.findOne();
    if (!user) {
        console.log('No user found');
        return;
    }
    console.log(`Testing for user: ${user.email}`);

    // Generate token
    const token = user.generateAuthToken();
    
    try {
        const response = await axios.get('http://localhost:5000/users/trips', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Response status:', response.status);
        console.log('Trips found:', response.data.length);
        console.log('First trip:', response.data[0]);
    } catch (error) {
        console.error('Error fetching trips:', error.response ? error.response.data : error.message);
    }

    mongoose.disconnect();
}

testUserTrips();