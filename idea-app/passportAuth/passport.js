const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../playground/key");
// console.log(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET");
// console.log(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID");
const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },

      async function (email, password, next) {
        try {
          //checking email
          const user = await User.findOne({ email });
          if (!user)
            return next(null, false, { message: "Invalid Email and Password" });

          //checking Password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return next(null, false, { message: "Invalid Email and Password" });

          return next(null, user, { message: "Loggedin Successfully" });
        } catch (error) {
          next(error);
        }
      }
    )
  );
  passport.serializeUser(function (user, next) {
    next(null, user);
  });

  passport.deserializeUser(async function (id, next) {
    try {
      const user = await User.findById(id);
      next(null, user);
    } catch (error) {
      next(error);
    }
  });
};

const googleStrategy = (passport) => {
  // console.log(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET");
  // console.log(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID");
  passport.use(
    new GoogleStrategy(
      {
        // clientID: process.env.GOOGLE_CLIENT_ID,
        clientID: GOOGLE_CLIENT_ID,
        // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, next) {
        try {
          // console.log(accessToken, refreshToken, profile, next);
          const profileToSave = {
            googleId: profile?.id,
            firstName: profile?.name?.givenName,
            lastName: profile?.name?.familyName,
            email: profile?.emails[0]?.value,
          };

          const user = await User.findOne({ googleId: profile?.id });
          if (user) {
            return next(null, user);
          } else {
            const creatingNewUserByGoogle = new User(profileToSave);
            await creatingNewUserByGoogle.save({ validateBeforeSave: false });
            console.log(creatingNewUserByGoogle, "creating google");
            return next(null, creatingNewUserByGoogle);
          }
        } catch (error) {
          next(error);
        }
      }
    )
  );
};

module.exports = { localStrategy, googleStrategy };
