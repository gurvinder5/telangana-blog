import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read initial states from URL params if present
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'All';

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchVal, setSearchVal] = useState(urlSearch);
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  const categories = ['All', 'Historical Places', 'Temples', 'Waterfalls', 'Food & Culture', 'Hyderabad Attractions'];

  // Sync state with URL params
  useEffect(() => {
    setSearchVal(urlSearch);
    setActiveCategory(urlCategory);
    fetchFilteredBlogs(urlSearch, urlCategory);
  }, [searchParams]); // Re-fetch when URL params change

  const fetchFilteredBlogs = async (search, category) => {
    try {
      setLoading(true);
      setError('');
      const res = await apiService.getBlogs(search, category);
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (err) {
      console.error('Blogs fetch error:', err.message);
      setError('Could not fetch travel blogs. Please check your network or server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams(searchVal, activeCategory);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    updateUrlParams(searchVal, category);
  };

  const updateUrlParams = (search, category) => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchVal('');
    setActiveCategory('All');
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <span className="text-uppercase tracking-wider small fw-bold text-teal" style={{ color: 'var(--primary-color)' }}>
          DISCOVER TELANGANA
        </span>
        <h1 className="fw-bold mt-1 mb-2">Tourism Travel Blogs</h1>
        <p className="text-muted max-w-lg mx-auto">
          Read detailed journals and itineraries penned by local experts and travelers visiting Telangana's historic sites.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-5">
        <form onSubmit={handleSearchSubmit} className="row g-3">
          <div className="col-lg-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-custom border-start-0 ps-0"
                placeholder="Search blogs by title name or location..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary-custom w-100">
              Apply Search
            </button>
            {(searchVal || activeCategory !== 'All') && (
              <button 
                type="button" 
                onClick={handleClearFilters} 
                className="btn btn-outline-danger px-3" 
                title="Clear Filters"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </form>

        <hr className="my-4 text-slate-200" />

        {/* Category Pills */}
        <div>
          <label className="form-label small fw-bold text-muted d-block mb-3">
            <i className="bi bi-funnel-fill me-1"></i> Filter by Category:
          </label>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs Display */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status" style={{ color: 'var(--primary-color)' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Filtering travel logs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-warning border-0 p-4 rounded-3 text-center my-3">
          <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-2 d-block"></i>
          <h5 className="fw-bold">{error}</h5>
          <p className="mb-0 text-muted">Please verify database and backend status.</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <i className="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No Blogs Found</h4>
          <p className="text-muted mb-4">
            We couldn't find any blogs matching your search term: <strong>"{searchVal || activeCategory}"</strong>.
          </p>
          <button onClick={handleClearFilters} className="btn btn-secondary-custom rounded-pill">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <span className="small text-muted">
              Showing <strong>{blogs.length}</strong> journal{blogs.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
