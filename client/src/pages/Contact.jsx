import React, { useState } from 'react';
import { apiService } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { name, email, subject, message } = formData;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      await apiService.submitContact({ name, email, subject, message });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success banner after 6 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="text-uppercase tracking-wider small fw-bold text-teal" style={{ color: 'var(--primary-color)' }}>
          GET IN TOUCH
        </span>
        <h1 className="fw-bold mt-1 mb-2">Contact Us</h1>
        <p className="text-muted max-w-lg mx-auto">
          Have queries about travel destinations or need assistance with blogging? Reach out to our community support.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Contact Info Cards */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-3 h-100">
            {/* Logo Card */}
            <div className="card border-0 p-4 shadow-sm text-center" style={{ borderRadius: '16px', background: '#fff' }}>
              <img src={`${import.meta.env.BASE_URL}logo-vertical.png`} alt="Telangana Tourism Logo" style={{ maxHeight: '110px', width: 'auto', margin: '0 auto' }} />
            </div>
            {/* Address Card */}
            <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center text-primary-color rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(13, 148, 136, 0.1)', flexShrink: 0, color: 'var(--primary-color)' }}>
                  <i className="bi bi-geo-alt-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Office Address</h6>
                  <p className="small text-muted mb-0">
                    Tourism House, Himayatnagar,<br />
                    Hyderabad, Telangana - 500029
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center text-primary-color rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(13, 148, 136, 0.1)', flexShrink: 0, color: 'var(--primary-color)' }}>
                  <i className="bi bi-telephone-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Helpline Phone</h6>
                  <p className="small text-muted mb-0">
                    +91 40 2345 0123<br />
                    Toll Free: 1800 425 4649
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center text-primary-color rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(13, 148, 136, 0.1)', flexShrink: 0, color: 'var(--primary-color)' }}>
                  <i className="bi bi-envelope-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email Support</h6>
                  <p className="small text-muted mb-0">
                    info@telanganatourism.gov.in<br />
                    support@explore-telangana.com
                  </p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="card border-0 p-4 shadow-sm mt-auto" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex align-items-center justify-content-center text-primary-color rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(13, 148, 136, 0.1)', flexShrink: 0, color: 'var(--primary-color)' }}>
                  <i className="bi bi-clock-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Operating Hours</h6>
                  <p className="small text-muted mb-0">
                    Monday – Saturday<br />
                    09:30 AM – 06:30 PM (IST)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 p-md-5 h-100" style={{ borderRadius: '20px' }}>
            <h4 className="fw-bold mb-3">Send Us a Message</h4>
            <p className="text-muted small mb-4">Feel free to submit suggestions, bug reports, or ask questions below.</p>

            {submitted && (
              <div className="alert alert-success border-0 p-3 rounded-3 mb-4" role="alert">
                <h6 className="fw-bold mb-1 text-success">
                  <i className="bi bi-check-circle-fill me-2"></i> Message Sent Successfully!
                </h6>
                <p className="small mb-0 text-muted">
                  Thank you for reaching out. A Telangana Tourism representative will review your message shortly.
                </p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger border-0 p-3 rounded-3 mb-4" role="alert">
                <h6 className="fw-bold mb-1 text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Submission Failed
                </h6>
                <p className="small mb-0 text-muted">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-custom"
                    placeholder="Enter name"
                    value={name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-custom"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control form-control-custom"
                  placeholder="e.g. Travel Guide Submission help"
                  value={subject}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Your Message</label>
                <textarea
                  name="message"
                  className="form-control form-control-custom"
                  rows="5"
                  placeholder="Type your detailed comments or questions..."
                  value={message}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
