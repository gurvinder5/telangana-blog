import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Register = ({ addToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, password, confirmPassword } = formData;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Basic field checks
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all input fields.');
      return;
    }

    // Password validation checks
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const res = await apiService.register(name, email, password);
      
      if (res.success) {
        addToast('Registration successful! You can now log in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message || 'An error occurred during registration. Please try again.');
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="form-card-custom">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-teal-light text-primary-color rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
                <i className="bi bi-person-plus fs-3" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h2 className="fw-bold mb-1">Create Account</h2>
              <p className="text-muted small">Sign up to document your explorations in Telangana</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-2 px-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Enter your name"
                    value={name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Create password (min 6 chars)"
                    value={password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-check2-circle text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Verify password"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2.5 rounded-3 mb-3 d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--primary-color)' }}>
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
