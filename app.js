const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const fileUpload = require("express-fileupload");
const formidable = require("express-formidable");

const app = express();

// swagger definition
var swaggerDefinition = {
	info: {
		title: "ZipDance API Docs",
		version: "1.0.0",
		description: "Documentation of the zip-dance API with Swagger"
	},
	host: "mcdan-zip-api.herokuapp.com",
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

app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "public", "api-docs")));
// Deployment Purpose
app.use(bodyParser.json());
// app.use(formidable());
// app.use(fileUpload());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

const comptitionRoute = require("./routes/competition");
app.use("/api/v1", comptitionRoute);

// serve swagger
app.get("/swagger.json", function(req, res) {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

app.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/sitemap", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "sitemap.html"));
});

app.get("/competition", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "competition.html"));
});

app.get("/new", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "new.html"));
});

app.get("/manage", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "manage.html"));
});

app.get("/scores", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "scores.html"));
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "api-docs", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port: " + port));
