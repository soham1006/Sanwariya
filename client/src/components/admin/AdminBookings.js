import React from 'react';
import AdminRoomBookings from './AdminRoomBookings';
import AdminMealBookings from './AdminMealBookings';
import AdminEventBookings from './AdminEventBookings';
import AdminContactMessages from './AdminContactMessages';

function AdminBookings() {
  return (
    <div className="container mt-5 my-5">

      {/* Room Bookings */}
      <section className="mb-5">
       
        <AdminRoomBookings />
      </section>

      {/* Meal Bookings */}
      <section className="mb-5">
        
        <AdminMealBookings />
      </section>

      {/* Event Bookings */}
      <section className="mb-5">
        
        <AdminEventBookings />
      </section>

        {/* Contact Messages */}
      <section className="mb-5">

        <AdminContactMessages />
      </section>

      <button
  className="btn btn-danger float-end"
  onClick={() => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/admin-login';
  }}
>
  Logout
</button>

    </div>
  );
}

export default AdminBookings;
