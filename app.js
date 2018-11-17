const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Body Parser Middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

// Deployment Purpose
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const comptitionRoute = require("./routes/competition");
app.use("/api/v1", comptitionRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port: " + port));
