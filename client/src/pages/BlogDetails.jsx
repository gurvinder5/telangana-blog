import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BlogDetails = ({ user, addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Blog Details States
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Guest Reviews States
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  
  // Submit Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch blog and reviews on initial load
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

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError('');
        const res = await apiService.getReviews(id);
        if (res.success) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error('Reviews loading error:', err.message);
        setReviewsError(err.message || 'Unable to load reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchBlogDetails();
    fetchReviews();
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

  // Review Form Submit Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      addToast('Please enter your name.', 'error');
      return;
    }

    if (!reviewerComment.trim()) {
      addToast('Please write a review comment.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await apiService.submitReview(id, {
        name: reviewerName,
        rating: reviewerRating,
        comment: reviewerComment
      });

      if (res.success) {
        addToast(res.message || 'Review submitted successfully!', 'success');
        
        // Reset form inputs
        setReviewerName('');
        setReviewerComment('');
        setReviewerRating(5);
        
        // Refresh reviews list
        const reviewsRes = await apiService.getReviews(id);
        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        }

        // Refresh blog details to update average ratings in the hero header
        const blogRes = await apiService.getBlogById(id);
        if (blogRes.success) {
          setBlog(blogRes.data);
        }
      }
    } catch (err) {
      console.error('Submit review error:', err.message);
      addToast(err.message || 'Failed to post review. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
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

  // Premium color-coded avatar style helper
  const getAvatarStyle = (name) => {
    let hash = 0;
    const nameStr = name || 'User';
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return {
      backgroundColor: `hsl(${h}, 65%, 42%)`,
      color: '#ffffff',
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1.25rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
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
                  <span className="d-none d-md-inline">•</span>
                  <span className="d-flex align-items-center gap-1">
                    <i className="bi bi-star-fill text-warning"></i>{' '}
                    {blog.review_count > 0 ? (
                      <>
                        <strong>{Number(blog.average_rating).toFixed(1)}</strong> ({blog.review_count} {blog.review_count === 1 ? 'review' : 'reviews'})
                      </>
                    ) : (
                      'No reviews'
                    )}
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

            {/* Traveler Reviews Section */}
            <div className="mt-5 bg-white p-4 p-md-5 rounded-4 shadow-sm border">
              <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-chat-left-text-fill text-teal" style={{ color: 'var(--primary-color)' }}></i>
                Traveler Reviews ({reviews.length})
              </h3>
              
              <div className="row g-4 mb-5">
                {/* Rating summary stats */}
                <div className="col-md-5">
                  <div className="h-100 p-4 rounded-4 bg-light d-flex flex-column align-items-center justify-content-center text-center border">
                    <span className="text-muted small fw-semibold text-uppercase tracking-wider mb-2">Average Rating</span>
                    <h2 className="display-4 fw-extrabold text-dark mb-1">
                      {blog.review_count > 0 ? Number(blog.average_rating).toFixed(1) : '0.0'}
                    </h2>
                    
                    {/* Stars */}
                    <div className="text-warning fs-4 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const avg = Number(blog.average_rating);
                        const isFull = star <= Math.floor(avg);
                        const isHalf = !isFull && star === Math.ceil(avg) && avg % 1 !== 0;
                        return (
                          <i 
                            key={star} 
                            className={`bi ${isFull ? 'bi-star-fill' : isHalf ? 'bi-star-half' : 'bi-star'} me-1`}
                          ></i>
                        );
                      })}
                    </div>
                    
                    <span className="text-muted small">
                      Based on {blog.review_count} {blog.review_count === 1 ? 'verified review' : 'verified reviews'}
                    </span>
                  </div>
                </div>

                {/* Rating distribution breakdown */}
                <div className="col-md-7">
                  <div className="h-100 p-4 rounded-4 bg-light border d-flex flex-column justify-content-center">
                    {[5, 4, 3, 2, 1].map((ratingVal) => {
                      const count = reviews.filter(r => r.rating === ratingVal).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={ratingVal} className="d-flex align-items-center gap-2 mb-2">
                          <span className="small fw-semibold text-muted" style={{ width: '50px' }}>
                            {ratingVal} Stars
                          </span>
                          <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
                            <div 
                              className="progress-bar bg-warning" 
                              role="progressbar" 
                              style={{ width: `${percentage}%`, borderRadius: '4px' }}
                              aria-valuenow={percentage} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <span className="small text-muted" style={{ width: '30px', textAlign: 'right' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form to submit review */}
              <div className="bg-light p-4 rounded-4 border mb-5 shadow-sm">
                <h4 className="fw-bold mb-3 text-dark">Share Your Experience</h4>
                <p className="text-muted small mb-4">
                  Have you visited this location? Let other travelers know how your journey was. No registration required!
                </p>
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="row g-3">
                    {/* Guest Name input */}
                    <div className="col-md-6">
                      <label htmlFor="reviewerName" className="form-label small fw-bold text-dark">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        id="reviewerName"
                        placeholder="Enter your name"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Star Rating picker */}
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                      <label className="form-label small fw-bold text-dark mb-1">
                        Your Rating <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex align-items-center gap-1 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="btn p-0 border-0 star-btn"
                            style={{
                              color: star <= (hoverRating || reviewerRating) ? '#f59e0b' : '#cbd5e1',
                              transition: 'all 0.15s ease-in-out',
                              cursor: 'pointer',
                              fontSize: '1.75rem',
                              transform: star === (hoverRating || reviewerRating) ? 'scale(1.15)' : 'scale(1)'
                            }}
                            onClick={() => setReviewerRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <i className={`bi ${star <= (hoverRating || reviewerRating) ? 'bi-star-fill' : 'bi-star'}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment text area */}
                    <div className="col-12">
                      <label htmlFor="reviewerComment" className="form-label small fw-bold text-dark">
                        Your Review <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control form-control-custom"
                        id="reviewerComment"
                        rows="4"
                        placeholder="Share your adventure, tips for visiting, local highlights, or tips for other travelers..."
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    {/* Submit button */}
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="btn btn-primary-custom px-4"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting Review...
                          </>
                        ) : (
                          <>
                            Submit Guest Review <i className="bi bi-send ms-1"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Review list */}
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">Recent Traveler Reviews</h4>
                
                {reviewsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-teal spinner-border-sm" role="status" style={{ color: 'var(--primary-color)' }}>
                      <span className="visually-hidden">Loading reviews...</span>
                    </div>
                    <p className="text-muted small mt-2">Loading reviews...</p>
                  </div>
                ) : reviewsError ? (
                  <div className="alert alert-danger border-0 small rounded-3">{reviewsError}</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-5 rounded-4 bg-light border border-dashed">
                    <i className="bi bi-chat-left-dots fs-1 text-muted opacity-50 mb-2 d-block"></i>
                    <p className="text-muted mb-0">No reviews yet for this destination. Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-4 border bg-white shadow-sm d-flex flex-column gap-3 transition-smooth-hover" style={{ transition: 'var(--transition-smooth)' }}>
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div className="d-flex align-items-center gap-3">
                            {/* Colorful Avatar Circle */}
                            <div style={getAvatarStyle(review.name)}>
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 className="fw-bold text-dark mb-0 text-capitalize">{review.name}</h6>
                              <span className="text-muted small">
                                Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          
                          {/* Rating display stars */}
                          <div className="text-warning small fs-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i 
                                key={star} 
                                className={`bi ${star <= review.rating ? 'bi-star-fill' : 'bi-star'} me-1`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        
                        <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1rem' }}>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
