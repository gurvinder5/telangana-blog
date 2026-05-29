import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const highlights = [
    { title: 'Rich Heritage & Dynasties', icon: 'bi-bank', desc: 'Home to the medieval Kakatiya Dynasty, the grand Qutb Shahis, and the wealthy Nizams of Hyderabad, creating a glorious synthesis of architectural and military structures.' },
    { title: 'Breathtaking Landscapes', icon: 'bi-flower1', desc: 'Lush deciduous forests, iconic monolithic rock formations like Bhuvanagiri, spectacular flowing waterfalls like Kuntala, and massive masonry irrigation dams like Nagarjuna Sagar.' },
    { title: 'Vibrant Culture & Festivals', icon: 'bi-music-note-beamed', desc: 'Famous for Bathukamma (a beautiful floral festival celebrated by women) and Bonalu (a thanksgiving festival to Mother Goddess), along with exquisite Bidriware handicrafts.' },
    { title: 'Delectable Culinary Arts', icon: 'bi-egg-fried', desc: 'Indulge in the world-renowned Hyderabadi Biryani, sensory Irani Chai, Osmania biscuits, spicy Telangana country curries, and unique festival sweets.' }
  ];

  return (
    <div>
      {/* Page Hero Header */}
      <section className="py-5 bg-dark text-white text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80") no-repeat center center/cover' }}>
        <div className="container py-4">
          <div className="mb-4 text-center d-flex justify-content-center">
            <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '6px 16px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <img src="/logo-emblem.png" alt="Telangana Emblem" style={{ height: '30px', width: 'auto' }} />
              <span className="text-dark fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>ABOUT THE STATE</span>
            </div>
          </div>
          <h1 className="display-4 fw-bold mb-3">Glorious Telangana</h1>
          <p className="lead text-light max-w-2xl mx-auto fs-5 opacity-90">
            A land where antiquity meets technological modernity, rich history blends with natural beauty, and vibrant festivals paint the Deccan Plateau.
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-uppercase tracking-wider small fw-bold text-teal" style={{ color: 'var(--primary-color)' }}>
                HISTORICAL SYNOPSIS
              </span>
              <h2 className="fw-bold mt-1 mb-4">A Legacy Carved in Stone and Culture</h2>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Formed as the 29th state of India on June 2, 2014, Telangana boasts a history that dates back thousands of years. The region flourished under great ancient dynasties. The Kakatiya Empire (12th-14th century) gifted spectacular water management reservoirs and architectural wonders like the Ramappa Temple, built with sandbox technology and floating bricks, and the Warangal Fort.
              </p>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Subsequently, the Qutb Shahi rulers established the grand Golconda Fort—a global trade center for legendary diamonds like the Koh-i-Noor. They also founded Hyderabad in 1591, building the majestic Charminar as the city's heart. Later, the Asaf Jahi Nizams transformed the capital into a wealthy cultural center.
              </p>
              <div className="mt-4">
                <Link to="/blogs" className="btn btn-primary-custom rounded-pill">
                  Explore Travel Blogs <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&h=400&q=80" alt="Charminar" className="img-fluid rounded-4 shadow-sm w-100" style={{ objectFit: 'cover', height: '220px' }} />
                </div>
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1600100397608-f010e42ed97c?auto=format&fit=crop&w=400&h=400&q=80" alt="Golconda" className="img-fluid rounded-4 shadow-sm w-100 mt-4" style={{ objectFit: 'cover', height: '220px' }} />
                </div>
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&h=400&q=80" alt="Ramappa" className="img-fluid rounded-4 shadow-sm w-100" style={{ objectFit: 'cover', height: '220px' }} />
                </div>
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&h=400&q=80" alt="Dam" className="img-fluid rounded-4 shadow-sm w-100 mt-4" style={{ objectFit: 'cover', height: '220px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Highlights Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Travel in Telangana?</h2>
            <p className="text-muted">Unveiling the unique pillars of Deccan travel experiences</p>
          </div>
          <div className="row g-4">
            {highlights.map((hl, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 p-4 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="d-inline-flex align-items-center justify-content-center text-primary-color rounded-circle mb-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-color)' }}>
                    <i className={`bi ${hl.icon} fs-4`}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{hl.title}</h5>
                  <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>{hl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
