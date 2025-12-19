const io = require('socket.io-client');
const axios = require('axios');

console.log('\n🧪 TESTING RIDE NOTIFICATION SYSTEM\n');

async function test() {
    try {
        // 1. Login as captain
        console.log('1. Logging in as captain...');
        const loginRes = await axios.post('http://localhost:5000/captains/login', {
            email: 'captain@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const captainId = loginRes.data.captain._id;
        console.log('✓ Logged in, Captain ID:', captainId);
        
        // 2. Connect socket
        console.log('\n2. Connecting socket...');
        const socket = io('http://localhost:5000');
        
        socket.on('connect', () => {
            console.log('✓ Socket connected:', socket.id);
            
            // 3. Join as captain
            console.log('\n3. Joining as captain...');
            socket.emit('join', {
                userId: captainId,
                userType: 'captain'
            });
            console.log('✓ Join event sent');
            
            // 4. Listen for rides
            console.log('\n4. Listening for new-ride events...');
            socket.on('new-ride', (data) => {
                console.log('\n🎉 NEW RIDE RECEIVED!');
                console.log('Pickup:', data.pickup);
                console.log('Destination:', data.destination);
                console.log('Fare:', data.fare);
                console.log('\n✅ RIDE NOTIFICATION SYSTEM WORKING!');
                process.exit(0);
            });
            
            console.log('✓ Listener registered');
            console.log('\n📱 Now create a ride from user side...');
            console.log('   Waiting for ride notification... (press Ctrl+C to cancel)');
        });
        
        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
            process.exit(1);
        });
        
    } catch (err) {
        console.error('❌ Error:', err.response?.data || err.message);
        process.exit(1);
    }
}

test();
