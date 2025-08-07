const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id }
        });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists by email (in case they had an account before OAuth)
        user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value }
        });

        if (user) {
          // Update existing user with Google ID
          user = await prisma.user.update({
            where: { email: profile.emails[0].value },
            data: {
              googleId: profile.id,
              profileImageUrl: profile.photos[0]?.value || user.profileImageUrl,
            }
          });
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImageUrl: profile.photos[0]?.value,
            profileCompleted: false,
          }
        });

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
