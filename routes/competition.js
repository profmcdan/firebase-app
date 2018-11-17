const router = require("express").Router();
const db = require("../config/firebaseInit");

// @desc GET Competitions
// @route /api/v1/competition
// @access Public
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
router.post("/competition", (req, res) => {
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
router.post("/competition/:id", (req, res) => {
	db
		.collection("competitions")
		.doc(req.params.id)
		.get()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ status: "Competition does not exist", error: error });
			}
			const newHeat = {
				heat_number: req.body.heat_number
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
// @route /api/v1/competition/:compID/heat/:heatID
// @access Public
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

module.exports = router;
