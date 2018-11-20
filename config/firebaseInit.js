const firebase = require("firebase");
const firebaseConfig = require("./keys").firebaseConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore_obj = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
firestore_obj.settings(settings);

module.exports = firestore_obj;
