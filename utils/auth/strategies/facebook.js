const passport = require("passport");
const axios = require("axios");
const boom = require("@hapi/boom");
const { Strategy: FacebookStrategy } = require("passport-facebook");

const { config } = require("../../../config");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async function (accesToken, refreshToken, { _json: profile }, cb) {
      try {
        console.log(profile);

        const { data, status } = await axios({
          url: `${config.apiUrl}/api/auth/sign-provider`,
          method: "post",
          data: {
            name: profile.name,
            email: profile.email,
            password: profile.id,
            apiKeyToken: config.apiKeyToken,
          },
        });

        if (!data || status !== 200) {
          return cb(boom.unauthorized(), false);
        }

        return cb(null, data);
      } catch (error) {
        cb(error);
      }
    }
  )
);
