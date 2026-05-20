import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const EditBlog = ({ user, addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Historical Places',
    location: '',
    image_url: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Historical Places', 'Temples', 'Waterfalls', 'Food & Culture', 'Hyderabad Attractions'];
  
  const { title, category, location, image_url, description } = formData;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiService.getBlogById(id);
        
        if (res.success) {
          const blog = res.data;
          
          // Verify ownership: only owner can edit
          if (user && blog.created_by !== user.id) {
            addToast('Unauthorized! You can only edit your own blogs.', 'error');
            navigate(`/blogs/${id}`);
            return;
          }

          setFormData({
            title: blog.title || '',
            category: blog.category || 'Historical Places',
            location: blog.location || '',
            image_url: blog.image_url || '',
            description: blog.description || ''
          });
        }
      } catch (err) {
        console.error('Fetch blog error on Edit Page:', err.message);
        setError('Could not retrieve blog data for editing.');
        addToast('Unable to load blog details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !location || !image_url || !description) {
      setError('Please fill in all the required form fields.');
      return;
    }

    if (description.length < 30) {
      setError('The blog description should be at least 30 characters long to provide a helpful travel report.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);

      const updatedData = {
        title,
        category,
        location: location.trim(),
        image_url,
        description
      };

      const res = await apiService.updateBlog(id, updatedData);
      
      if (res.success) {
        addToast('Travel blog updated successfully!', 'success');
        navigate(`/blogs/${id}`);
      }
    } catch (err) {
      console.error('Update blog error:', err.message);
      setError(err.message || 'Unable to update blog post. Please try again.');
      addToast(err.message || 'Failed to update travel blog.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-auto">
        <div className="spinner-border text-teal" role="status" style={{ color: 'var(--primary-color)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading blog details for editing...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="form-card-custom">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-teal-light text-primary-color rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
                <i className="bi bi-pencil-square fs-3" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h2 className="fw-bold mb-1">Edit Travel Blog</h2>
              <p className="text-muted small">Update your published exploration stories and guides</p>
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
                  placeholder="e.g. A Majestic Journey to Golconda Fort"
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

                {/* Location Input */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-dark">Travel Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control form-control-custom"
                    placeholder="e.g. Golconda Fort, Warangal"
                    value={location}
                    onChange={handleInputChange}
                    required
                  />
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
                    placeholder="Paste a direct image URL"
                    value={image_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Description Content */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Travel Blog Journal</label>
                <textarea
                  name="description"
                  className="form-control form-control-custom"
                  rows="7"
                  placeholder="Tell your stories..."
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
                <Link to={`/blogs/${id}`} className="btn btn-secondary-custom px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 d-flex align-items-center justify-content-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
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

export default EditBlog;
