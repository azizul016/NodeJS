const secretSession = process.env.SECRET_SESSION;
const jwtScrectKey = process.env.JWT_SECRET_KEY;
const host = process.env.HOST;
const forgetPasswordJWTToken = process.env.FORGET_PASSWORD_JWT_SECRET;
const localDB = process.env.LOCAL_DB;
const cloudDB = process.env.CLOUD_DB;

module.exports = {
  jwtScrectKey,
  secretSession,
  host,
  forgetPasswordJWTToken,
  cloudDB,
  localDB,
};
