const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport');
const {User} = require('./models/LoginRouter')

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            // scope:["profile","email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              let user = await User.findOne({ where: { googleId: profile.id } });
      
              if (!user) {
                user = await User.create({ googleId: profile.id, name: profile.displayName });
              }
      
              return done(null, user); 
            } catch (error) {
              return done(error, null);
            }
          }
        )
    
)

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });