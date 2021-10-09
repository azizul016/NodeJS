const secretSession = process.env.SECRET_SESSION;
const jwtScrectKey = process.env.JWT_SECRET_KEY;
const host = process.env.HOST;
const forgetPasswordJWTToken = process.env.FORGET_PASSWORD_JWT_SECRET;

module.exports = { jwtScrectKey, secretSession, host, forgetPasswordJWTToken };
