import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchVal, setSearchVal] = useState('');

  // Categories list
  const categories = [
    { name: 'Historical Places', icon: 'bi-bank', desc: 'Explore Kakatiya and Qutb Shahi historic structures.' },
    { name: 'Temples', icon: 'bi-brightness-high', desc: 'Visit UNESCO wonders and ancient holy sites.' },
    { name: 'Waterfalls', icon: 'bi-droplet-half', desc: 'Bask in natural river waterfalls and green vistas.' },
    { name: 'Food & Culture', icon: 'bi-egg-fried', desc: 'Indulge in authentic Biryani and traditional festivals.' },
    { name: 'Hyderabad Attractions', icon: 'bi-building', desc: 'Experience the visual gems of the historic state capital.' }
  ];

  // Featured tourist locations
  const suggestedLocations = [
    { name: 'Charminar', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80', desc: 'Sultanate minarets and active street bazaars.' },
    { name: 'Golconda Fort', img: 'https://images.unsplash.com/photo-1600100397608-f010e42ed97c?auto=format&fit=crop&w=400&q=80', desc: 'Acoustic marvels and granite fortress ruins.' },
    { name: 'Ramappa Temple', img: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80', desc: 'UNESCO Heritage floating bricks mastercraft.' },
    { name: 'Bhongir Fort', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80', desc: 'Monolithic granite dome adventure and trekking.' },
    { name: 'Nagarjuna Sagar', img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80', desc: 'Giant masonry dam and serene valley cruises.' }
  ];

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const res = await apiService.getBlogs();
        if (res.success) {
          // Take top 3 latest blogs as featured
          setFeaturedBlogs(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Home Page Loading Error:', err.message);
        setError('Could not connect to the backend server. Please verify if the database and server are active.');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBlogs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <header className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4 d-flex justify-content-center animate__animated animate__fadeInDown">
                <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '8px 20px', borderRadius: '50px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`${import.meta.env.BASE_URL}logo-emblem.png`} alt="Telangana Emblem" style={{ height: '35px', width: 'auto' }} />
                  <span className="text-dark fw-bold" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>OFFICIAL TRAVEL PORTAL</span>
                </div>
              </div>
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 font-weight-600 animate__animated animate__fadeInDown">
                <i className="bi bi-stars me-1"></i> WELCOME TO TELANGANA
              </span>
              <h1 className="hero-title">Experience the Jewel of the Deccan</h1>
              <p className="lead text-light mb-5 fs-5 max-w-2xl mx-auto opacity-90">
                Explore majestic Kakatiya forts, legendary temples, spectacular waterfalls, authentic local culinary delights, and the historic charm of Hyderabad.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="row g-2 justify-content-center max-w-xl mx-auto">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0 ps-3 text-muted">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 py-3 ps-2 rounded-end"
                      placeholder="Search landmarks or locations (e.g. Charminar, Palampet)..."
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-warning w-100 py-3 font-weight-600 rounded-3 text-dark">
                    Search Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Explore by Categories</h2>
            <p className="text-muted">Choose your interest and explore tailored travel stories</p>
          </div>
          <div className="row g-4 justify-content-center">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-md-6 col-lg-4 col-xl-2.4">
                <div 
                  className="card h-100 text-center border-0 p-4 shadow-sm" 
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '16px',
                    backgroundColor: '#f8fafc' 
                  }}
                  onClick={() => navigate(`/blogs?category=${encodeURIComponent(cat.name)}`)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="d-inline-flex align-items-center justify-content-center bg-teal-light text-primary-color rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
                    <i className={`bi ${cat.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold fs-6 mb-2">{cat.name}</h5>
                  <p className="small text-muted mb-0">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-5">
            <div>
              <h2 className="fw-bold mb-1">Latest Travel Stories</h2>
              <p className="text-muted mb-0">Read amazing tourist guides shared by our explorer community</p>
            </div>
            <Link to="/blogs" className="btn btn-secondary-custom rounded-pill">
              View All Blogs <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-teal" role="status" style={{ color: 'var(--primary-color)' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Fetching fresh articles for you...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning border-0 p-4 rounded-3 text-center my-3">
              <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-2 d-block"></i>
              <h5 className="fw-bold">{error}</h5>
              <p className="mb-0 text-muted">You can register/login and post blogs once the connection to your local MySQL is completed.</p>
            </div>
          ) : featuredBlogs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No travel blogs have been written yet. Be the first to add one!</p>
              <Link to="/add-blog" className="btn btn-primary-custom">
                Write a Blog Post
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {featuredBlogs.map((blog) => (
                <div key={blog.id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Suggested Locations Showcase */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Famous Landmark Hotspots</h2>
            <p className="text-muted">Incredible places to add to your Telangana bucket list immediately</p>
          </div>
          <div className="row g-4">
            {suggestedLocations.map((loc, idx) => (
              <div key={idx} className="col-md-6 col-lg-4 col-xl-2.4">
                <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '16px' }}>
                  <img src={loc.img} alt={loc.name} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2">{loc.name}</h5>
                    <p className="small text-muted mb-3">{loc.desc}</p>
                    <button 
                      onClick={() => navigate(`/blogs?search=${encodeURIComponent(loc.name)}`)}
                      className="btn btn-link p-0 text-teal fw-bold text-decoration-none small"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      Search Stories <i className="bi bi-chevron-right small"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
