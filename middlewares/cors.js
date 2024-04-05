function referrerPolicy(req, res, next) {
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
}

module.exports = {
  referrerPolicy,
};