function referrerPolicy(req, res, next) {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

module.exports = {
  referrerPolicy,
};