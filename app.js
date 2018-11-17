const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const app = express();

// swagger definition
var swaggerDefinition = {
	info: {
		title: "ZipDance API Docs",
		version: "1.0.0",
		description: "Documentation of the zip-dance API with Swagger"
	},
	host: "https://mcdan-zip-api.herokuapp.com",
	basePath: "/"
};

// options for the swagger docs
var options = {
	// import swaggerDefinitions
	swaggerDefinition: swaggerDefinition,
	// path to the API docs
	apis: [ "./routes/*.js" ]
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// Body Parser Middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(express.static(path.join(__dirname, "public", "api-docs")));
// Deployment Purpose
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const comptitionRoute = require("./routes/competition");
app.use("/api/v1", comptitionRoute);

// serve swagger
app.get("/swagger.json", function(req, res) {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "api-docs", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port: " + port));
