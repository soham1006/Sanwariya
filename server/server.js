require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors()); // Allows frontend (localhost:3000) to talk to backend (localhost:5000)
app.use(express.json()); // Parses incoming JSON data

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const mealBookingRoutes = require('./routes/mealBookingRoutes');
const eventBookingRoutes = require('./routes/eventBookings');
const bookingRoutes = require('./routes/bookingRoute');
const contactRoutes = require('./routes/contactRoute');

app.use('/api/meal-bookings', mealBookingRoutes);
app.use('/api/event-bookings', eventBookingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Health check route (optional)
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
