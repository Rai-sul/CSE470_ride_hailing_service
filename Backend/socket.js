const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            console.log(`User joining - Type: ${userType}, ID: ${userId}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} joined with socketId: ${socket.id}`);
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'active'
                });
                console.log(`Captain ${userId} joined with socketId: ${socket.id}, status: active`);
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat]
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            // Set captain status to inactive when they disconnect
            captainModel.findOneAndUpdate(
                { socketId: socket.id },
                { status: 'inactive' }
            ).catch(err => console.error('Error updating captain status:', err));
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

    console.log(`Sending to socketId ${socketId}:`, messageObject.event);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`Message sent to ${socketId}`);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };