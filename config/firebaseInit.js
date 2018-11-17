const firebase = require("firebase");
const firebaseConfig = require("./keys").firebaseConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp.firestore();
