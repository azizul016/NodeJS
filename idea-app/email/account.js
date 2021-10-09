const { host } = require("../config/key");
const emailSendConfig = () => {
  return {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sonia.fahey@ethereal.email",
      pass: "AzSMYbzmVcSzgxVhpm",
    },
  };
};
const registrationEmail = (toEmail, token) => {
  return {
    from: "abc@gamil.com", // sender address
    to: toEmail,
    subject: "Welcome to Idea App", // Subject line
    text: `Welcome to Idea App. Please Click THis Link For Active Your Account. <a href="${host}/auth/active/${token}">Active Account</a>`,
    html: `Welcome to Idea App. Please Click THis Link For Active Your Account. <a href="${host}/auth/active/${token}">Active Account</a>`,
  };
};
const deleteAccountAndSendingEmail = (toEmail) => {
  return {
    from: "abc@gamil.com", // sender address
    to: toEmail,
    subject: "Delete your account", // Subject line
    text: "You Delete your idea app account", // plain text body
    html: "<b>You Delete your idea app account</b>", // html body
  };
};

const forgetPasswordEmail = (toEmail, token) => {
  return {
    from: "abc@gamil.com", // sender address
    to: toEmail,
    subject: "Forget Your Password", // Subject line
    text: `Welcome to Idea App. Please Click THis Link For Forget Your Password. <a href="${host}/auth/reset-password/${token}">Active Account</a>`,
    html: `Welcome to Idea App. Please Click THis Link For Forget Your Password. <a href="${host}/auth/reset-password/${token}">Active Account</a>`,
  };
};

module.exports = {
  registrationEmail,
  emailSendConfig,
  deleteAccountAndSendingEmail,
  forgetPasswordEmail,
};
