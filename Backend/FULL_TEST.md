# 🎯 COMPLETE WORKING TEST

## ✅ Test Accounts Created:

### Captain:
- Email: `captain@test.com`
- Password: `password123`

### User:
- Email: `user@test.com`
- Password: `password123`

---

## 📝 STEP-BY-STEP TEST:

### 1️⃣ START BACKEND
```bash
cd ~/Desktop/uber-video-mapbox/Backend
node server.js
```

Wait for:
```
Server is running on port 5000
Connected to DB
```

---

### 2️⃣ CAPTAIN SIDE (Browser Tab 1)

1. **Open:** `http://localhost:5173/captain-login`

2. **Login:**
   - Email: `captain@test.com`
   - Password: `password123`

3. **Backend Console Should Show:**
   ```
   Client connected: [socketId]
   User joining - Type: captain, ID: [id]
   Captain [id] joined with socketId: [socketId], status: active
   ```

4. **Allow Location** when browser asks

5. **Keep this tab open!**

---

### 3️⃣ USER SIDE (Browser Tab 2 / Incognito)

1. **Open:** `http://localhost:5173/login`

2. **Login:**
   - Email: `user@test.com`
   - Password: `password123`

3. **Create Ride:**
   - Pickup: Type at least 3 characters (e.g., "Mir")
   - Select from dropdown: "Mirpur, Dhaka"
   - Destination: Type "Gul"
   - Select: "Gulshan, Dhaka"
   - Choose vehicle type
   - Click "Create Ride" or "Find Trip"

4. **Backend Console Should Show:**
   ```
   Found X active captains in radius
   Sending ride to captain: [id], socketId: [socketId]
   📤 Sending to socketId [socketId]: new-ride
   ✓ Message sent to [socketId]
   ```

---

### 4️⃣ CHECK CAPTAIN TAB

**POPUP SHOULD APPEAR! 🎉**

Shows:
- User name
- Pickup location
- Destination
- Fare
- Accept/Ignore buttons

---

## 🔍 IF NOT WORKING:

### Check Backend Console:
```bash
# Should see these messages in order:
✓ Captain [id] joined with socketId: [socketId], status: active
✓ Found X active captains in radius
✓ Sending ride to captain: [id], socketId: [socketId]
✓ 📤 Sending to socketId [socketId]: new-ride
✓ ✓ Message sent to [socketId]
```

### Check Captain Browser Console (F12):
```
✓ Connected to server
✓ New ride received: {object with pickup, destination, fare}
```

### Common Issues:
1. **401 Unauthorized** → User not logged in correctly
2. **Found 0 captains** → Captain not active or wrong location
3. **No popup** → Frontend not refreshed with new code

---

## 🔄 TROUBLESHOOTING:

### Issue: User can't create ride (401 error)
**Solution:**
1. Logout user
2. Login again with `user@test.com` / `password123`
3. Check that token is saved: `localStorage.getItem('token')`

### Issue: Captain doesn't see popup
**Solution:**
1. **Hard refresh captain page:** Ctrl+Shift+R
2. Login again
3. Check backend shows "Captain joined"
4. Allow location permission

### Issue: "Found 0 captains"
**Solution:**
- Captain must be logged in and on Captain Home page
- Backend must show "status: active"
- Location must be updated

---

## 🎉 SUCCESS CRITERIA:

✅ Backend shows all messages correctly
✅ Captain sees popup with ride details
✅ User sees "Looking for driver" screen
✅ No 401/400 errors in console

