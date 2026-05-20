const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Please log in to complete this action.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assign user payload to the request object so subsequent middleware/controllers have access
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Your session has expired or is invalid. Please log in again.' 
    });
  }
};

module.exports = verifyToken;
