import React, { useState } from 'react';
import axios from 'axios';

function MealBooking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/meal-bookings', formData)
      .then(() => {
        alert('Meal reservation submitted successfully!');
        setFormData({
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          specialRequests: ''
        });
      })
      .catch(err => {
        console.error('Error submitting meal booking:', err);
        alert('Something went wrong. Please try again.');
      });
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
              <label className="form-label">Reservation Date</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Time</label>
              <input type="time" name="time" className="form-control" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Guests</label>
              <input type="number" name="guests" className="form-control" value={formData.guests} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Special Requests (optional)</label>
              <textarea name="specialRequests" className="form-control" rows="3" value={formData.specialRequests} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">Submit Reservation</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MealBooking;
