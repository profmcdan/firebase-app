require("dotenv").config();

const config = {
	firebaseConfig2: {
		apiKey: process.env.apiKey,
		authDomain: process.env.authDomain,
		databaseURL: process.env.databaseURL,
		projectId: process.env.projectId,
		storageBucket: process.env.storageBucket,
		messagingSenderId: process.env.messagingSenderId
	},
	cloudinaryConfig: {
		cloud_name: "dm9ykdajq",
		api_key: "249255527367216",
		api_secret: "RO3LZy3ld8-Xi-kug5mk1_ofZsI"
	}
};

module.exports = config;
