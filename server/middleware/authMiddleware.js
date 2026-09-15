const jwt = require("jsonwebtoken");

// =====================================================
// AUTHENTICATE USER
// =====================================================

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader
    .substring(7)
    .trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure the JWT contains a valid role.
    if (
      !decoded.role ||
      !["voter", "admin"].includes(decoded.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid authentication role.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
}

// =====================================================
// REQUIRE ADMIN
// =====================================================

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
}

// =====================================================
// REQUIRE VOTER
// =====================================================

function requireVoter(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "voter") {
    return res.status(403).json({
      success: false,
      message: "Voter access required.",
    });
  }

  if (!req.user.voterMongoId) {
    return res.status(403).json({
      success: false,
      message: "Invalid voter authentication.",
    });
  }

  next();
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  authenticate,
  requireAdmin,
  requireVoter,
};