import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Components
import Navbar from './components/Navbar';
import IntroVideo from './components/IntroVideo';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Show intro video only once per browser session
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('intro_played')
  );

  const handleIntroFinish = () => {
    sessionStorage.setItem('intro_played', 'true');
    setShowIntro(false);
  };

  // Load session from local storage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse active session user object:', e);
        localStorage.clear();
      }
    }
  }, []);

  // Handle successful login
  const handleLogin = (token, loggedInUser) => {
    setUser(loggedInUser);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    addToast('Logged out successfully! Come back soon.', 'success');
  };

  // Helper to append toast notifications
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto-remove toast after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  // Helper to remove individual toast
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <>
      {showIntro && <IntroVideo onFinish={handleIntroFinish} />}
    <Router>
      {/* Navigation bar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Pages Content viewport */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails user={user} addToast={addToast} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/add-blog" 
            element={
              <ProtectedRoute user={user}>
                <AddBlog addToast={addToast} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-blog/:id" 
            element={
              <ProtectedRoute user={user}>
                <EditBlog user={user} addToast={addToast} />
              </ProtectedRoute>
            } 
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} addToast={addToast} />} />
          <Route path="/register" element={<Register addToast={addToast} />} />
          
          {/* Catch-all Redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer Segment */}
      <footer className="footer-custom">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-5">
              <h5 className="text-white fw-bold mb-3">
                <i className="bi bi-compass-fill text-warning me-2"></i>Telangana Tourism Blog
              </h5>
              <p className="small max-w-sm" style={{ lineHeight: '1.7' }}>
                A modern full-stack tourism blogging platform promoting the majestic landmarks, rich temples, cascading waterfalls, local culinary arts, and cultural festivals of India's youngest state.
              </p>
            </div>
            <div className="col-6 col-lg-3">
              <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2">
                <li><Link to="/" className="text-decoration-none text-muted-hover text-reset">Home Landing</Link></li>
                <li><Link to="/blogs" className="text-decoration-none text-muted-hover text-reset">Travel Blogs</Link></li>
                <li><Link to="/about" className="text-decoration-none text-muted-hover text-reset">About Telangana</Link></li>
                <li><Link to="/contact" className="text-decoration-none text-muted-hover text-reset">Contact Helpline</Link></li>
              </ul>
            </div>
            <div className="col-6 col-lg-4">
              <h6 className="text-white fw-bold mb-3">Explore Categories</h6>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/blogs?category=Historical%20Places" className="badge bg-secondary text-decoration-none">Historical Places</Link>
                <Link to="/blogs?category=Temples" className="badge bg-secondary text-decoration-none">Temples</Link>
                <Link to="/blogs?category=Waterfalls" className="badge bg-secondary text-decoration-none">Waterfalls</Link>
                <Link to="/blogs?category=Food%20%26%20Culture" className="badge bg-secondary text-decoration-none">Food & Culture</Link>
                <Link to="/blogs?category=Hyderabad%20Attractions" className="badge bg-secondary text-decoration-none">Hyderabad Attractions</Link>
              </div>
            </div>
          </div>
          <hr className="my-4 border-slate-700 opacity-20" />
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <span className="small text-muted">
              © {new Date().getFullYear()} Telangana Tourism Blog. Built with React & Node.js.
            </span>
            <div className="d-flex gap-3 small">
              <span className="text-muted">Explore the Deccan</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Toast Notifications Container */}
      <div className="toast-container-custom">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-custom toast-${toast.type}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex align-items-center gap-2">
              {toast.type === 'success' ? (
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
              ) : (
                <i className="bi bi-exclamation-circle-fill text-danger fs-5"></i>
              )}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              className="btn-close ms-2 fs-7"
              aria-label="Close"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        ))}
      </div>
    </Router>
    </>
  );
}

export default App;
