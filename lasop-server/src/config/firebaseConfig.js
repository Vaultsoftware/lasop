// config/firebaseConfig.js
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('../../lasop-test-firebase-adminsdk-ql9js-4913b23920.json');

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'lasop-test.appspot.com', // Replace with your actual bucket name
});

// Export the storage instance
const storage = getStorage(app);
module.exports = { storage };
