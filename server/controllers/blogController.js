const db = require('../config/db');

// @desc    Get all blogs (with optional search and category filters)
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = async (req, res) => {
  const { search, category } = req.query;

  try {
    let query = `
      SELECT b.id, b.title, b.description, b.image_url, b.location, b.category, b.created_at, b.created_by, u.name as author,
             COALESCE(AVG(r.rating), 0) as average_rating, COUNT(r.id) as review_count
      FROM blogs b 
      JOIN users u ON b.created_by = u.id
      LEFT JOIN reviews r ON b.id = r.blog_id
    `;
    const queryParams = [];
    const conditions = [];

    // Filter by search string (title or location)
    if (search) {
      conditions.push('(b.title LIKE ? OR b.location LIKE ?)');
      const searchWildcard = `%${search}%`;
      queryParams.push(searchWildcard, searchWildcard);
    }

    // Filter by category
    if (category && category !== 'All') {
      conditions.push('b.category = ?');
      queryParams.push(category);
    }

    // Append WHERE conditions if filters exist
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Group by to support aggregations
    query += ' GROUP BY b.id, u.name';

    // Order by latest blogs first
    query += ' ORDER BY b.created_at DESC';

    const [blogs] = await db.query(query, queryParams);
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to load blogs.' });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const [blogs] = await db.query(
      `SELECT b.id, b.title, b.description, b.image_url, b.location, b.category, b.created_at, b.created_by, u.name as author,
              COALESCE(AVG(r.rating), 0) as average_rating, COUNT(r.id) as review_count
       FROM blogs b 
       JOIN users u ON b.created_by = u.id 
       LEFT JOIN reviews r ON b.id = r.blog_id
       WHERE b.id = ?
       GROUP BY b.id, u.name`,
      [id]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Tourist blog post not found.' });
    }

    res.status(200).json({ success: true, data: blogs[0] });
  } catch (error) {
    console.error('Error fetching single blog:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to load blog details.' });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
  const { title, description, image_url, location, category } = req.body;
  const userId = req.user.id; // From verifyToken middleware

  // Simple validation
  if (!title || !description || !image_url || !location || !category) {
    return res.status(400).json({ success: false, message: 'All fields (title, description, image_url, location, category) are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO blogs (title, description, image_url, location, category, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, location, category, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Tourist blog successfully posted!',
      blogId: result.insertId
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to post blog.' });
  }
};

// @desc    Update an existing blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, location, category } = req.body;
  const userId = req.user.id; // From verifyToken middleware

  // Simple validation
  if (!title || !description || !image_url || !location || !category) {
    return res.status(400).json({ success: false, message: 'All fields (title, description, image_url, location, category) are required.' });
  }

  try {
    // Check if blog exists
    const [blogs] = await db.query('SELECT created_by FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Tourist blog post not found.' });
    }

    // Verify ownership (only creator can update)
    if (blogs[0].created_by !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You are not the author of this blog.' });
    }

    // Update details
    await db.query(
      'UPDATE blogs SET title = ?, description = ?, image_url = ?, location = ?, category = ? WHERE id = ?',
      [title, description, image_url, location, category, id]
    );

    res.status(200).json({
      success: true,
      message: 'Tourist blog updated successfully!'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to update blog.' });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // From verifyToken middleware

  try {
    // Check if blog exists
    const [blogs] = await db.query('SELECT created_by FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Tourist blog post not found.' });
    }

    // Verify ownership (only creator can delete)
    if (blogs[0].created_by !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You are not the author of this blog.' });
    }

    // Delete blog
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Tourist blog deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Server error: unable to delete blog.' });
  }
};
