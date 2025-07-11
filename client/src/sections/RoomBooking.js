import React, { useState } from 'react';
import axios from 'axios';

function RoomBooking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', formData);
      alert('Booking request submitted! We will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        roomType: '',
        checkIn: '',
        checkOut: '',
        guests: ''
      });
    } catch (err) {
      console.error(err);
      alert('Something went wrong while submitting the booking.');
    }
  };

  return (
    <div className="form-section container mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Room Type</label>
              <select name="roomType" className="form-select" value={formData.roomType} onChange={handleChange} required>
                <option value="">-- Select Room Type --</option>
                <option value="AC">AC Room</option>
                <option value="Non-AC">Non-AC Room</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input type="number" name="guests" className="form-control" value={formData.guests} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-In Date</label>
              <input type="date" name="checkIn" className="form-control" value={formData.checkIn} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-Out Date</label>
              <input type="date" name="checkOut" className="form-control" value={formData.checkOut} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">Submit Booking</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RoomBooking;
