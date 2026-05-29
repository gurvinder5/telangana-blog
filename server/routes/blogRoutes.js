const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');

// Publicly accessible routes
// Endpoint: GET /api/blogs -> Fetch all blogs (with optional filters)
router.get('/', blogController.getAllBlogs);

// Endpoint: GET /api/blogs/:id -> Fetch details for a specific blog
router.get('/:id', blogController.getBlogById);

// Reviews Sub-resource Routes (Publicly accessible)
// Endpoint: GET /api/blogs/:id/reviews -> Fetch all reviews for a blog
router.get('/:id/reviews', reviewController.getReviewsForBlog);

// Endpoint: POST /api/blogs/:id/reviews -> Submit a review for a blog
router.post('/:id/reviews', reviewController.addReview);

// Protected routes (valid login authorization token required)
// Endpoint: POST /api/blogs -> Add a new blog post
router.post('/', verifyToken, blogController.createBlog);

// Endpoint: PUT /api/blogs/:id -> Modify an existing blog post (must be creator)
router.put('/:id', verifyToken, blogController.updateBlog);

// Endpoint: DELETE /api/blogs/:id -> Remove an existing blog post (must be creator)
router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router;
