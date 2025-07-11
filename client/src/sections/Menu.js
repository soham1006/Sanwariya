import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

function Menu() {
  const foodImages = [
    { src: '/images/menu/dish1.jpg', label: 'Manchurian' },
    { src: '/images/menu/dish2.jpg', label: 'Aloo Paratha' },
    { src: '/images/menu/dish3.jpg', label: 'Delicious Pizza' },
    { src: '/images/menu/dish4.jpg', label: 'Paneer Bullet & Cheese Monaco' },
    { src: '/images/menu/dish5.jpg', label: 'Masala Cheese Sandwich' },
    { src: '/images/menu/dish6.jpg', label: 'Special Deluxe Thali' },
  ];

  const [index, setIndex] = useState(-1);

  return (
    <section id="menu" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden elegant-title mb-4">Our Restaurant Menu</h2>

        <p className="text-center text-muted mb-5">
          Enjoy home-style vegetarian meals, snacks, and hot beverages — all freshly prepared with love at Shree Sanwariya Hotel.
        </p>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
          }}
          style={{ paddingBottom: '40px' }} 
        >
          {foodImages.map((dish, idx) => (
            <SwiperSlide key={idx}>
              <div className="card h-100 shadow-sm animate-fade" style={{ maxWidth: '320px', margin: 'auto' }}>
                <div style={{ height: '400px', overflow: 'hidden' }}>
  <img
    src={dish.src}
    alt={dish.label}
    className="w-100"
    style={{
      height: '100%',
      objectFit: 'cover',
      cursor: 'pointer',
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem'
    }}
    onClick={() => setIndex(idx)}
  />
</div>

                <div className="card-body p-2 text-center">
                  <h6 className="text-golden fw-bold">{dish.label}</h6>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {index >= 0 && (
          <Lightbox
            open={index >= 0}
            close={() => setIndex(-1)}
            slides={foodImages.map(img => ({ src: img.src, title: img.label }))}
            index={index}
            
          />
        )}

        <div className="text-center mt-4">
          <a href="#bookings" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill shadow">
            Book a Meal
          </a>
        </div>
      </div>
    </section>
  );
}

export default Menu;
