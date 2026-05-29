import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { id, title, description, image_url, location, category, created_at, author } = blog;

  // Format timestamp into human readable local format
  const formatPublishDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper fallback for broken Unsplash/external images
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="card blog-card">
      <div className="blog-card-img-wrapper">
        <span className="blog-card-badge">{category}</span>
        <img
          src={image_url}
          alt={title}
          className="blog-card-img"
          onError={handleImageError}
        />
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="text-dark font-weight-500">
            <i className="bi bi-geo-alt-fill text-danger me-1"></i> {location}
          </span>
          <span className="mx-1">•</span>
          <span>
            <i className="bi bi-calendar3 me-1"></i> {formatPublishDate(created_at)}
          </span>
        </div>

        {/* Rating summary */}
        <div className="d-flex align-items-center gap-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
          {blog.review_count > 0 ? (
            <div className="d-flex align-items-center gap-1">
              <span className="text-warning">
                <i className="bi bi-star-fill"></i>
              </span>
              <strong className="text-dark">{Number(blog.average_rating).toFixed(1)}</strong>
              <span className="text-muted">({blog.review_count} {blog.review_count === 1 ? 'review' : 'reviews'})</span>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-1 text-muted opacity-75">
              <span><i className="bi bi-star"></i></span>
              <span>No reviews yet</span>
            </div>
          )}
        </div>

        <h3 className="blog-card-title text-capitalize">{title}</h3>
        <p className="blog-card-text text-muted">{description}</p>
        
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <span className="small text-muted text-truncate" style={{ maxWidth: '140px' }}>
            <i className="bi bi-person-fill text-teal me-1"></i>
            By <strong>{author || 'Explorer'}</strong>
          </span>
          <Link to={`/blogs/${id}`} className="btn btn-sm btn-primary-custom px-3">
            Explore <i className="bi bi-arrow-right-short ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
