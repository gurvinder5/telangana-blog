const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yummy-colony-dares.ngrok-free.dev/api';

// Core helper to retrieve standard headers including JWT authorizations
const getRequestHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Main fetch wrapper function supporting custom options and proper error catching
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const finalOptions = {
    ...options,
    headers: {
      ...getRequestHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, finalOptions);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! Status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error(`API Call failed at [${endpoint}]:`, error.message);
    throw error;
  }
};

// Exported API endpoint mapping
export const apiService = {
  // Authentication Routes
  register: (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },
  
  login: (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Blogs CRUD Routes
  getBlogs: (searchQuery = '', categoryFilter = '') => {
    const queryParameters = [];
    
    if (searchQuery) {
      queryParameters.push(`search=${encodeURIComponent(searchQuery)}`);
    }
    
    if (categoryFilter && categoryFilter !== 'All') {
      queryParameters.push(`category=${encodeURIComponent(categoryFilter)}`);
    }
    
    const queryString = queryParameters.length > 0 ? `?${queryParameters.join('&')}` : '';
    return apiRequest(`/blogs${queryString}`, { method: 'GET' });
  },

  getBlogById: (id) => {
    return apiRequest(`/blogs/${id}`, { method: 'GET' });
  },

  createBlog: (blogData) => {
    return apiRequest('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  },

  updateBlog: (id, blogData) => {
    return apiRequest(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  },

  deleteBlog: (id) => {
    return apiRequest(`/blogs/${id}`, {
      method: 'DELETE'
    });
  },

  // Contact Form Submission Route
  submitContact: (contactData) => {
    return apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  // Blog Reviews Routes
  getReviews: (blogId) => {
    return apiRequest(`/blogs/${blogId}/reviews`, {
      method: 'GET'
    });
  },

  submitReview: (blogId, reviewData) => {
    return apiRequest(`/blogs/${blogId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }
};
