const mongoose = require('mongoose');


function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.error('DB Connection Error:', err.message);
    });
}


module.exports = connectToDb;