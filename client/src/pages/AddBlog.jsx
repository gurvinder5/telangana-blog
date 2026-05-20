import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const AddBlog = ({ addToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Historical Places',
    location: 'Charminar',
    customLocation: '',
    image_url: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useCustomLoc, setUseCustomLoc] = useState(false);

  const categories = ['Historical Places', 'Temples', 'Waterfalls', 'Food & Culture', 'Hyderabad Attractions'];
  const suggestedLocations = ['Charminar', 'Golconda Fort', 'Ramappa Temple', 'Bhongir Fort', 'Nagarjuna Sagar'];

  const { title, category, location, customLocation, image_url, description } = formData;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Work out final location string
    const finalLocation = useCustomLoc ? customLocation.trim() : location;

    // Validations
    if (!title || !category || !finalLocation || !image_url || !description) {
      setError('Please fill in all the required form fields.');
      return;
    }

    if (description.length < 30) {
      setError('The blog description should be at least 30 characters long to provide a helpful travel report.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const blogData = {
        title,
        category,
        location: finalLocation,
        image_url,
        description
      };

      const res = await apiService.createBlog(blogData);
      
      if (res.success) {
        addToast('Travel blog published successfully!', 'success');
        navigate(`/blogs/${res.blogId}`);
      }
    } catch (err) {
      console.error('Create blog error:', err.message);
      setError(err.message || 'Unable to publish blog post. Please try again.');
      addToast(err.message || 'Failed to post travel blog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="form-card-custom">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-teal-light text-primary-color rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
                <i className="bi bi-journal-plus fs-3" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h2 className="fw-bold mb-1">Create Travel Blog</h2>
              <p className="text-muted small">Share your exploration stories and guides across Telangana</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-2 px-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-custom"
                  placeholder="e.g. A Scenic Sunset Trek up Bhongir Monolith"
                  value={title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row">
                {/* Category Selection */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-dark">Tourism Category</label>
                  <select
                    name="category"
                    className="form-select form-control-custom"
                    value={category}
                    onChange={handleInputChange}
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location Selection */}
                <div className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-dark mb-0">Travel Location</label>
                    <button
                      type="button"
                      className="btn btn-link p-0 small text-decoration-none"
                      style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}
                      onClick={() => setUseCustomLoc(!useCustomLoc)}
                    >
                      {useCustomLoc ? 'Use suggested spots' : 'Type custom location'}
                    </button>
                  </div>

                  {useCustomLoc ? (
                    <input
                      type="text"
                      name="customLocation"
                      className="form-control form-control-custom"
                      placeholder="e.g. Bhoodan Pochampally, Warangal"
                      value={customLocation}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select
                      name="location"
                      className="form-select form-control-custom"
                      value={location}
                      onChange={handleInputChange}
                    >
                      {suggestedLocations.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Cover Image URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border-slate-200">
                    <i className="bi bi-image text-muted"></i>
                  </span>
                  <input
                    type="url"
                    name="image_url"
                    className="form-control form-control-custom border-start-0 ps-0"
                    placeholder="Paste a direct image URL (e.g. from Unsplash)"
                    value={image_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-text small text-muted">
                  Use high-quality images. Recommended standard: Unsplash source link.
                </div>
              </div>

              {/* Description Content */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Travel Blog Journal</label>
                <textarea
                  name="description"
                  className="form-control form-control-custom"
                  rows="7"
                  placeholder="Tell your stories... describe the path, highlights, acoustics, history, ticket prices, timings, food spots, and anything helpful for other travelers..."
                  value={description}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <div className="form-text small text-muted text-end">
                  Min. 30 characters. Supports paragraphs.
                </div>
              </div>

              {/* Action buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <Link to="/blogs" className="btn btn-secondary-custom px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Publishing...
                    </>
                  ) : (
                    'Publish Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
