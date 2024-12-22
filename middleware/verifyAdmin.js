const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: No user found in request",
      access: false,
    });
  }

  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: admin access required", access: false });
  }

  next();
};

module.exports = verifyAdmin;
