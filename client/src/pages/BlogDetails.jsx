import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BlogDetails = ({ user, addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiService.getBlogById(id);
        if (res.success) {
          setBlog(res.data);
        }
      } catch (err) {
        console.error('Blog details loading error:', err.message);
        setError(err.message || 'Unable to retrieve blog details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete this travel blog post? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      const res = await apiService.deleteBlog(id);
      if (res.success) {
        addToast('Tourist blog deleted successfully.', 'success');
        navigate('/blogs');
      }
    } catch (err) {
      console.error('Delete error:', err.message);
      addToast(err.message || 'Could not delete blog post.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
  };

  const formatPublishDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-auto">
        <div className="spinner-border text-teal" role="status" style={{ color: 'var(--primary-color)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading travel story details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning border-0 p-4 rounded-3 text-center my-3">
          <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-2 d-block"></i>
          <h4 className="fw-bold">Blog Post Not Found</h4>
          <p className="mb-4 text-muted">{error || 'This article might have been removed.'}</p>
          <Link to="/blogs" className="btn btn-primary-custom rounded-pill">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && blog.created_by === user.id;

  return (
    <div>
      {/* Blog Detail Hero Header */}
      <div className="detail-hero">
        <img
          src={blog.image_url}
          alt={blog.title}
          className="detail-hero-img"
          onError={handleImageError}
        />
        <div className="detail-hero-overlay">
          <div className="container">
            <div className="row">
              <div className="col-lg-10">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 font-weight-600">
                  {blog.category}
                </span>
                <h1 className="display-4 fw-bold text-white mb-3 text-capitalize">{blog.title}</h1>
                <div className="d-flex flex-wrap align-items-center gap-3 text-light small opacity-90">
                  <span>
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i> {blog.location}
                  </span>
                  <span className="d-none d-md-inline">•</span>
                  <span>
                    <i className="bi bi-calendar3 me-1"></i> {formatPublishDate(blog.created_at)}
                  </span>
                  <span className="d-none d-md-inline">•</span>
                  <span>
                    <i className="bi bi-pencil-square me-1"></i> Written by: <strong>{blog.author || 'Anonymous'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Details Body */}
      <div className="container py-5">
        <div className="row g-5 justify-content-center">
          <div className="col-lg-9">
            {/* Action buttons for author */}
            {isAuthor && (
              <div className="bg-white border rounded-4 p-3 mb-4 d-flex justify-content-between align-items-center shadow-sm">
                <span className="small text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i> You are the author of this blog post.
                </span>
                <div className="d-flex gap-2">
                  <Link to={`/edit-blog/${blog.id}`} className="btn btn-outline-primary btn-sm px-3 rounded-3">
                    <i className="bi bi-pencil me-1"></i> Edit
                  </Link>
                  <button
                    onClick={handleDeleteClick}
                    className="btn btn-outline-danger btn-sm px-3 rounded-3"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-1"></i> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
              {/* Introduction quote */}
              <div className="border-start border-4 border-teal ps-3 mb-4 py-1" style={{ borderColor: 'var(--primary-color) !important' }}>
                <p className="lead text-muted mb-0">
                  A wonderful travel journal documenting our exploration journey of <strong>{blog.location}</strong>. Find detailed highlights below!
                </p>
              </div>

              {/* Text Body */}
              <div className="blog-detail-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem', color: '#334155' }}>
                {blog.description}
              </div>

              {/* Share and back buttons */}
              <hr className="my-5 text-slate-200" />
              
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <Link to="/blogs" className="btn btn-secondary-custom px-4 rounded-pill">
                  <i className="bi bi-arrow-left me-1"></i> Back to All Blogs
                </Link>
                <div className="d-flex gap-2">
                  <button className="btn btn-light rounded-circle" title="Share on Facebook" onClick={() => addToast('Link copied to clipboard! (Demo)', 'success')}>
                    <i className="bi bi-facebook text-primary"></i>
                  </button>
                  <button className="btn btn-light rounded-circle" title="Share on Twitter" onClick={() => addToast('Link copied to clipboard! (Demo)', 'success')}>
                    <i className="bi bi-twitter text-info"></i>
                  </button>
                  <button className="btn btn-light rounded-circle" title="Copy Link" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    addToast('Article URL copied to clipboard!', 'success');
                  }}>
                    <i className="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
