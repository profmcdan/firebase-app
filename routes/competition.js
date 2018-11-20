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

const upload = multer({ dest: "./assets/" });

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "dance",
	allowedFormats: [ "jpg", "png" ],
	transformation: [ { width: 500, height: 500, crop: "limit" } ]
});

const parser = multer({ storage: storage });

router.post("/upload2", upload.single("image"), (req, res) => {
	console.log(req.files.image);
	if (req.files) {
		console.log("Uploading file...");
		var filename = req.files.image.name;
		var uploadStatus = "File Uploaded Successfully";
	} else {
		console.log("No File Uploaded");
		var filename = "FILE NOT UPLOADED";
		var uploadStatus = "File Upload Failed";
	}

	/* ===== Add the function to save filename to database ===== */

	return res.send({ status: uploadStatus, filename: `Name Of File: ${filename}` });
});

const uploadImage = (imgPath) => {
	cloudinary.v2.uploader.upload(imgPath, { crop: "limit", tags: "samples", width: 3000, height: 2000 }, function(
		result
	) {
		console.log(result);
		return result;
	});
};

router.post("/upload", parser.single("image"), (req, res) => {
	console.log(req.file);
	const image = {};
	if (req.file) {
		console.log("Uploading file...");
		image.url = req.file.url;
		image.id = req.file.public_id;
		var filename = image.url;
		var uploadStatus = "File Uploaded Successfully";
	} else {
		console.log("No File Uploaded");
		var filename = "FILE NOT UPLOADED";
		var uploadStatus = "File Upload Failed";
	}

	/* ===== Add the function to save filename to database ===== */

	return res.send({ status: uploadStatus, filename: `Name Of File: ${filename}`, image: image });
});

router.post("/images", parser.single("image"), function(req, res) {
	cloudinary.v2.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		console.log(result);
		var image = req.body.image;
		image = result.secure_url;

		return res.json({ result: result });
	});
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
router.post("/competition", (req, res) => {
	const { errors, isValid } = validateCompetitionInput(req.body, req.body.image);
	// Check Validation
	if (!isValid) {
		return res.status(400).json({ errors });
	}
	const newComp = {
		title: req.body.title,
		image: req.body.image,
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
	if (!isValid) {
		return res.status(400).json({ errors });
	}
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
 *           $ref: '#/definitions/Heat'
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
module.exports = router;
