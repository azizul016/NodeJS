const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

const forgetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 2, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

module.exports = { registerLimiter, loginLimiter, forgetPasswordLimiter };
