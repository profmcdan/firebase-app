const router = require("express").Router();
const db = require("../config/firebaseInit");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const apiKey = require("../config/keys").cloudinaryConfig;
// setup
cloudinary.config(apiKey);

// Load Input Validation
const validateCompetitionInput = require("../validation/competition");
const validateHeatInput = require("../validation/heat");
const validateScoreInput = require("../validation/scores");

// Init Upload
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const cloudStorage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "dance",
	allowedFormats: [ "jpg", "png" ],
	transformation: [ { width: 500, height: 500, crop: "limit" } ]
});

const upload = multer({
	storage: cloudStorage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

router.post("/upload", upload.single("image"), (req, res) => {
	const image = { image: req.file.url };
	console.log(req.file);
	return res.json({ url: image });
});

// @desc GET Competitions
// @route /api/v1/competition
// @access Public
/**
 * @swagger
 * definitions:
 *   Competitions:
 *     properties:
 *       title:
 *         type: string
 *       location:
 *         type: string
 *       start_date:
 *         type: string
 *       end_date:
 *         type: string
 */
/**
 * @swagger
 * definitions:
 *   Competition:
 *     properties:
 *       title:
 *         type: string
 *       location:
 *         type: string
 *       start_date:
 *         type: string
 *       end_date:
 *         type: string
 */
/**
 * @swagger
 * definitions:
 *   Heat:
 *     properties:
 *       heat_number:
 *         type: string
 *       competition:
 *         type: string
 */
/**
 * @swagger
 * definitions:
 *   Score:
 *     properties:
 *       first_position:
 *         type: string
 *       second_position:
 *         type: string
 *       third_position:
 *         type: string
 *       fourth_position:
 *         type: string
 *       fifth_position:
 *         type: string
 *       sixth_position:
 *         type: string
 *       user:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/competition:
 *   get:
 *     tags:
 *       - Competition
 *     description: Returns all competitions
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of competitions
 *         schema:
 *           $ref: '#/definitions/Competition'
 */
router.get("/competition", (req, res) => {
	var query = [];
	db
		.collection("competitions")
		.get()
		.then((snapshot) => {
			snapshot.forEach((doc) => {
				var cData = doc.data();
				cData.id = doc.id;
				query.push(cData);
			});
			return res.send({ status: "OK", data: query });
		})
		.catch((error) => {
			return res.status(404).json({ status: "Failed", error: error });
		});
});

// @desc GET a competition
// @route /api/v1/competition/:id
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}:
 *   get:
 *     tags:
 *       - Competition
 *     description: Returns a single Competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Competition's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single Competition
 *         schema:
 *           $ref: '#/definitions/Competition'
 */
router.get("/competition/:id", (req, res) => {
	db
		.collection("competitions")
		.doc(req.params.id)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ status: "COmpetition does not exist", error: error });
			} else {
				var cData = doc.data();
				cData.id = doc.id;
				console.log("Document data:", doc.data());
				return res.send({ status: "OK", data: cData });
			}
		})
		.catch((err) => {
			console.log("Error getting document", err);
		});
});

// @desc POST a competition
// @route /api/v1/competition/
// @access Public
/**
 * @swagger
 * /api/v1/competition/:
 *   post:
 *     tags:
 *       - Competition
 *     description: Creates a new competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: competition
 *         description: Competition object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Competition'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post("/competition", upload.single("image"), (req, res) => {
	const image = req.file.url;
	const { errors, isValid } = validateCompetitionInput(req.body);
	// Check Validation
	if (!isValid) {
		return res.status(400).json({ errors });
	}
	const newComp = {
		title: req.body.title,
		image: image,
		location: req.body.location,
		start_date: req.body.start_date,
		end_date: req.body.end_date
	};
	try {
		const docRef = db.collection("competitions").add(newComp);
		return res.send({ status: "OK", data: docRef });
	} catch (error) {
		return res.status(404).json({ status: "Failed", error: error });
	}
});

// @desc POST a heat
// @route /api/v1/competition/:compID
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}:
 *   post:
 *     tags:
 *       - Heat
 *     description: Creates a new heat in a competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: heat
 *         description: heat object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Heat'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post("/competition/:id", (req, res) => {
	const { errors, isValid } = validateHeatInput(req.body);
	// Check Validation
	if (!isValid) {
		return res.status(400).json({ errors });
	}
	db
		.collection("competitions")
		.doc(req.params.id)
		.get()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ status: "Competition does not exist", error: error });
			}
			const newHeat = {
				heat_number: req.body.heat_number,
				date: req.body.date,
				time: req.body.time
			};
			db
				.collection("competitions")
				.doc(req.params.id)
				.collection("heats")
				.add(newHeat)
				.then((nData) => {
					nData
						.get()
						.then((heat) => {
							const cData = heat.data();
							console.log(cData);
							cData.id = heat.id;
							cData.competition = req.params.id;
							return res.send({ status: "OK", data: cData });
						})
						.catch((error) => {
							return res.status(404).json({ status: "Cannot update", error: error });
						});
				})
				.catch((error) => {
					return res.status(404).json({ status: "Cannot update", error: error });
				});
		})
		.catch((error) => {
			console.log(error);
			return res.status(404).json({ status: "Competition does not exist", error: error });
		});
});

// @desc GET all heat in a competition
// @route /api/v1/competition/:compID/heats
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}/heats:
 *   get:
 *     tags:
 *       - Heat
 *     description: Returns all heats in a Competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Competition's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: All Heats in a Competition
 *         schema:
 *           $ref: '#/definitions/Heat'
 */
router.get("/competition/:id/heats", (req, res) => {
	const heats = [];
	const compID = req.params.id;
	// check the comptition if it exist, else throw a 404
	db
		.collection("competitions")
		.doc(compID)
		.collection("heats")
		.get()
		.then((subDocs) => {
			subDocs.forEach((collection) => {
				console.log("Found subcollection with id:", collection.id);
				const cData = collection.data();
				cData.id = collection.id;
				cData.competition = compID;
				heats.push(cData);
			});
			return res.send({ status: "OK", data: heats });
		})
		.catch((error) => {
			console.log(error);
			return res.status(404).json({ status: "Cannot get heats", error: error });
		});
});

// @desc GET a given heat in a competition
// @route /api/v1/competition/:compID/heats/:heatID
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}/heats/{heatId}:
 *   get:
 *     tags:
 *       - Heat
 *     description: Returns a single heat in a Competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Competition's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: heatID
 *         description: Heat's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single heat in a Competition
 *         schema:
 *           $ref: '#/definitions/Heat'
 */
router.get("/competition/:id/heats/:heatID", (req, res) => {
	db
		.collection("competitions")
		.doc(req.params.id)
		.collection("heats")
		.doc(req.params.heatID)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ status: "Heat does not exist", error: error });
			} else {
				var cData = doc.data();
				cData.id = doc.id;
				cData.competition = req.params.id;
				console.log("Document data:", doc.data());
				return res.send({ status: "OK", data: cData });
			}
		})
		.catch((err) => {
			console.log("Error getting document", err);
		});
});

// @desc POST a score in a given heat in a competition
// @route /api/v1/competition/:compID/heats/:heatID/score
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}/heats/{heatID}/score:
 *   post:
 *     tags:
 *       - Score
 *     description: Creates a new score in a heat
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: score
 *         description: score object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Score'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post("/competition/:id/heats/:heatID/score", (req, res) => {
	const { errors, isValid } = validateScoreInput(req.body);
	// Check Validation
	// if (!isValid) {
	// 	return res.status(400).json({ errors });
	// }
	const {
		first_position,
		second_position,
		third_position,
		fourth_position,
		fifth_position,
		sixth_position,
		user
	} = req.body;
	const { id, heatID } = req.params;

	const newScore = {
		first_position,
		second_position,
		third_position,
		fourth_position,
		fifth_position,
		sixth_position,
		user
	};
	if (!user) {
		return res.status(404).json({ errors: "User required" });
	}

	// check if user has voted.
	const query = [];
	db
		.collection("competitions")
		.doc(id)
		.collection("heats")
		.doc(heatID)
		.collection("scores")
		.where("user", "==", user)
		.get()
		.then((doc) => {
			if (!doc) {
				console.log("im here false");
				return { status: "false" };
			}
			doc.forEach((score) => {
				var cData = score.data();
				cData.id = score.id;
				cData.competition = id;
				cData.heat = heatID;
				query.push(cData);
			});
			console.dir({ exists: query.length });
			if (query.length > 0) {
				return res.status(404).json({ errors: "User has already voted" });
			}
		})
		.catch((err) => {
			return { errors: err };
		});

	db
		.collection("competitions")
		.doc(id)
		.get()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ status: "Competition does not exist", error: error });
			}
			// check if heat exists
			db
				.collection("competitions")
				.doc(id)
				.collection("heats")
				.doc(heatID)
				.get()
				.then((doc) => {
					if (!doc) {
						return res.status(404).json({ status: "Heat does not exist" });
					}
					// post a new score
					db
						.collection("competitions")
						.doc(id)
						.collection("heats")
						.doc(heatID)
						.collection("scores")
						.add(newScore)
						.then((nData) => {
							nData
								.get()
								.then((score) => {
									const cData = score.data();
									console.log(cData);
									cData.id = score.id;
									cData.competition = id;
									cData.heat = heatID;
									return res.send({ status: "OK", data: cData });
								})
								.catch((error) => {
									return res.status(404).json({ status: "Cannot update", error: error });
								});
						})
						.catch((error) => {
							return res.status(404).json({ status: "Cannot update", error: error });
						});
				})
				.catch((error) => {
					return res.status(404).json({ status: "Cannot update", error: error });
				});
		})
		.catch((error) => {
			console.log(error);
			return res.status(404).json({ status: "Competition does not exist", error: error });
		});
});

// @desc GET all scores in a given heat in a competition
// @route /api/v1/competition/:compID/heats/:heatID/score
// @access Public
/**
 * @swagger
 * /api/v1/competition/{id}/heats/{heatId}/score/{user}:
 *   get:
 *     tags:
 *       - Score
 *     description: Returns a single score for a in a Competition
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Competition's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: heatID
 *         description: Heat's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: user
 *         description: User's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A score in a heat for a given user in a Competition
 *         schema:
 *           $ref: '#/definitions/Score'
 */
router.get("/competition/:id/heats/:heatID/score/:user", (req, res) => {
	const { id, heatID, user } = req.params;
	var query = [];
	db
		.collection("competitions")
		.doc(id)
		.collection("heats")
		.doc(heatID)
		.collection("scores")
		.where("user", "==", user)
		.get()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ error: "Score does not exist" });
			}
			doc.forEach((score) => {
				var cData = score.data();
				cData.id = score.id;
				cData.competition = id;
				cData.heat = heatID;
				query.push(cData);
			});
			console.log("Document data:", query);
			if (query.length < 1) {
				return res.status(404).json({ error: "Score does not exist" });
			}
			return res.send({ status: "OK", data: query });
		})
		.catch((err) => {
			console.log("Error getting document", err);
		});
});

/**
 * @swagger
 * /api/v1/competition/{id}/heats/{heatID}/score:
 *   get:
 *     tags:
 *       - Score
 *     description: Returns a Judges and zipDancer's score for a in a heat.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Competition's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: heatID
 *         description: Heat's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A score in a heat for in a Competition
 *         schema:
 *           $ref: '#/definitions/Score'
 */
router.get("/competition/:id/heats/:heatID/score", (req, res) => {
	const { id, heatID } = req.params;
	const judgeRating = {
		first_position: "001",
		second_position: "230",
		third_position: "102",
		fourth_position: "122",
		fifth_position: "422",
		sixth_position: "100"
	};
	const dancersRating = {
		first_position: "230",
		second_position: "230",
		third_position: "001",
		fourth_position: "122",
		fifth_position: "100",
		sixth_position: "422"
	};

	return res.json({ comeptition: id, heat: heatID, judgeRating, dancersRating });
});

module.exports = router;
