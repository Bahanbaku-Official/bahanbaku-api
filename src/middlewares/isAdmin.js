module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: false,
      message: 'You is not an admin',
    })
  }

  next();
}