// Simple middleware - no file upload needed, just pass through
// Image URLs are now accepted directly in the request body
const passThrough = (req, res, next) => {
  // No file upload processing needed
  // Image URL will come from req.body.image
  next();
};

module.exports = passThrough;
