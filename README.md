🏨 Hotel & Restaurant Production Platform

A production-grade full-stack web application built for a local hotel & restaurant to support online food ordering, service discovery, and admin-side management.
The platform is deployed on a custom domain, serves real users, and includes OTP-based authentication, delivery logic, and analytics tracking.

🔗 Live Website: https://shrisanwariya.in/

🚀 Key Features
👤 Customer Features

Browse restaurant menu and hotel services

OTP-based email verification before placing orders

Secure checkout with Cash on Delivery (COD) and UPI

UPI QR-based payment with UTR confirmation

Interactive map-based address selection

Automatic delivery charge calculation based on distance

Clear feedback and order confirmation flow

📍 Smart Location & Delivery

Uses Leaflet.js + OpenStreetMap (Nominatim) for location selection

Draggable map pin for accurate delivery location

Distance-based delivery logic:

≤ 2 km → Free delivery

2–5 km → ₹30

5–10 km → ₹50

10 km → Delivery not available

🛠 Admin Panel

Role-based access control (RBAC)

Manage:

Rooms

Restaurant menu

User entries

Orders & booking-related requests

Designed for non-technical business owners

🔐 Authentication & Security

OTP-based email verification for users

Protected routes using JWT

Order placement allowed only after verified login

Server-side validation for orders and delivery radius

📊 Analytics

Integrated Google Analytics (GA4)

Tracks:

Real-time active users

Traffic sources

User behavior & drop-off points

Analytics used to improve UX clarity for local users

🧱 Tech Stack
Frontend

React.js

React Router

Axios

Bootstrap

Leaflet.js

QRCode Generator

Backend

Node.js

Express.js

REST APIs

Database

MongoDB

Maps & Geocoding

OpenStreetMap

Nominatim API

Payments

Cash on Delivery (COD)

UPI QR-based payments with manual confirmation

Analytics

Google Analytics (GA4)

Deployment

Frontend: Netlify

Backend: Render

Media: Cloudinary

Custom Domain Enabled

🎯 Project Objectives

Build a real-world production system for a local business

Handle real users, real orders, and real constraints

Design UX suitable for small-town and non-technical users

Gain experience with:

OTP authentication

Location-based delivery logic

Payment flow integration

Admin dashboards

Production deployment & monitoring

📌 Key Learnings

Implementing OTP-based authentication flows

Handling map-based UX and delivery validation

Designing order systems with payment verification

Managing state-heavy checkout flows in React

Using analytics data to improve usability

Deploying and maintaining a live production app

⚠️ Important Note

UPI payments are manually verified using UTR, not automated payment gateways.

This project focuses on practical business usability, not large-scale payment processing.

👤 Author

Soham Mewada

GitHub: https://github.com/soham1006

LinkedIn: https://linkedin.com/in/soham-mewada
