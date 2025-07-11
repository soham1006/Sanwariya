import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', form);
      alert('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Try again.');
    }
  };

  return (
    <section id="contact" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden elegant-title mb-4">Get in Touch</h2>
        <p className="text-center text-muted mb-4">Have questions or want to book manually? We're just a message away.</p>

        <div className="row justify-content-center">
          <div className="col-md-6 mb-4">
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light animate-fade">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  className="form-control"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-5 offset-md-1 mb-4">
            <div className="bg-white p-4 rounded shadow-sm animate-fade h-100">
              <h5 className="text-golden mb-3">Contact Details</h5>
              <p className="mb-2"><strong>Address:</strong><br />Central Bank, Near Panchmukhi Chauraha, Kalapipal Mandi, Madhya Pradesh 465337</p>
              <p className="mb-2"><strong>Phone:</strong> <a href="tel:+919753600206" className="text-dark text-decoration-none">+91 97536 00206</a></p>
              <p className="mb-2"><strong>Email:</strong> <a href="mailto:info@sanwariyahotel.com" className="text-dark text-decoration-none">info@sanwariyahotel.com</a></p>
              <p className="mb-0"><strong>Hours:</strong> 9:00 AM – 11:00 PM (Everyday)</p>
            </div>
          </div>
        </div>

        {/* 📍 Embedded Google Map */}
        <div className="map-responsive mt-4 rounded shadow-sm overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.366849949334!2d76.83490977503682!3d23.338720304457034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c9747224f8f35%3A0xbca252c9bac0d99f!2sShri%20Sanwariya%20Palace%20%26%20Restaurant!5e0!3m2!1sen!2sin!4v1751543292600!5m2!1sen!2sin"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Shree Sanwariya Hotel Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Contact;
