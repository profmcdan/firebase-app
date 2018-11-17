require("dotenv").config();

const config = {
	firebaseConfig: {
		apiKey: process.env.apiKey,
		authDomain: process.env.authDomain,
		databaseURL: process.env.databaseURL,
		projectId: process.env.projectId,
		storageBucket: process.env.storageBucket,
		messagingSenderId: process.env.messagingSenderId

		// apiKey: "AIzaSyBTgTVUeuz7f6TFj1Hc-BOxTffYf58-EAE",
		// authDomain: "zip-dance.firebaseapp.com",
		// databaseURL: "https://zip-dance.firebaseio.com",
		// projectId: "zip-dance",
		// storageBucket: "zip-dance.appspot.com",
		// messagingSenderId: "356081457910"
	}
};

module.exports = config;

// var testConfig = {
// 	apiKey: process.env.apiKey,
// 	authDomain: process.env.authDomain,
// 	databaseURL: process.env.databaseURL,
// 	projectId: process.env.projectId,
// 	storageBucket: process.env.storageBucket,
// 	messagingSenderId: process.env.messagingSenderId
// };
