import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Login = ({ onLogin, addToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password } = formData;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both your email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const res = await apiService.login(email, password);
      
      if (res.success) {
        // Save session credentials
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Notify parent state
        onLogin(res.token, res.user);
        
        // Toast message and redirect
        addToast('Successfully logged in! Welcome back.', 'success');
        navigate('/blogs');
      }
    } catch (err) {
      console.error('Login Error details:', err.message);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      addToast(err.message || 'Invalid email or password.', 'error');
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
              <div className="d-inline-flex align-items-center justify-content-center mb-3 text-warning bg-dark bg-gradient rounded-circle" style={{ width: '75px', height: '75px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <i className="bi bi-shield-lock-fill fs-2" style={{ color: '#f59e0b' }}></i>
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small">Log in to post and manage your Telangana travel blogs</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-2 px-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
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

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-dark mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Enter password"
                    value={password}
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
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none fw-bold" style={{ color: 'var(--primary-color)' }}>
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
