const db = require('../config/db');

// @desc    Get all reviews for a specific blog
// @route   GET /api/blogs/:id/reviews
// @access  Public
exports.getReviewsForBlog = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the blog post exists first
    const [blogs] = await db.query('SELECT id FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Tourist blog post not found.' });
    }

    const [reviews] = await db.query(
      'SELECT id, blog_id, name, rating, comment, created_at FROM reviews WHERE blog_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to load reviews.' });
  }
};

// @desc    Submit a review for a specific blog (No Login Required)
// @route   POST /api/blogs/:id/reviews
// @access  Public
exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { name, rating, comment } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Your name is required to submit a review.' });
  }

  if (rating === undefined || rating === null) {
    return res.status(400).json({ success: false, message: 'Please select a star rating.' });
  }

  const parsedRating = parseInt(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
  }

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please enter a review comment.' });
  }

  try {
    // Check if the blog post exists
    const [blogs] = await db.query('SELECT id FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Tourist blog post not found.' });
    }

    // Insert review
    const [result] = await db.query(
      'INSERT INTO reviews (blog_id, name, rating, comment) VALUES (?, ?, ?, ?)',
      [id, name.trim(), parsedRating, comment.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your travel blog review has been submitted successfully.',
      reviewId: result.insertId
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to submit your review.' });
  }
};
