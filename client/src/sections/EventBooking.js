import React, { useState } from 'react';
import axios from 'axios';

function EventBooking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occasion: '',
    guests: '',
    date: '',
    time: '',
    specialRequests: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/event-bookings', formData);
      alert('Your event booking has been submitted!');
      setFormData({
        name: '',
        phone: '',
        occasion: '',
        guests: '',
        date: '',
        time: '',
        specialRequests: '',
      });
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="form-section container mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form className="shadow p-4 bg-light rounded" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Occasion</label>
              <select name="occasion" className="form-select" value={formData.occasion} onChange={handleChange} required>
                <option value="">-- Select Occasion --</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input type="number" name="guests" className="form-control" value={formData.guests} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Time</label>
              <input type="time" name="time" className="form-control" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Special Requests</label>
              <textarea name="specialRequests" className="form-control" rows="3" value={formData.specialRequests} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">
              Submit Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventBooking;
