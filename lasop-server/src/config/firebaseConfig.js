// src/config/firebaseConfig.js
// Firebase disabled for this build. Prevents app from crashing at startup.
module.exports = {
  admin: null,
  storage: {
    bucket() {
      throw new Error(
        'Firebase Storage is disabled. Migrate this route to GridFS or configure FIREBASE_* env vars.'
      );
    },
  },
};
