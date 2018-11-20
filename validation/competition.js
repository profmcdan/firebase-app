const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCompetitionInput(data, imageUrl) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : "";
	let image = !isEmpty(imageUrl) ? imageUrl : "";
	data.location = !isEmpty(data.location) ? data.location : "";
	data.start_date = !isEmpty(data.start_date) ? data.start_date : "";
	data.end_date = !isEmpty(data.end_date) ? data.end_date : "";

	if (
		!Validator.isLength(data.title, {
			min: 5,
			max: 30
		})
	) {
		errors.title = "Title must be between 5 and 30 characters";
	}

	if (Validator.isEmpty(data.title)) {
		errors.title = "Title field is required";
	}

	if (Validator.isEmpty(image)) {
		errors.image = "image field is required";
	}

	if (!Validator.isURL(image)) {
		errors.image = "Image link is invalid";
	}

	if (Validator.isEmpty(data.location)) {
		errors.location = "Location field is required";
	}

	if (Validator.isEmpty(data.start_date)) {
		errors.start_date = "Start date field is required";
	}

	if (Validator.isEmpty(data.end_date)) {
		errors.end_date = "End date field is required";
	}

	return {
		errors: errors,
		isValid: isEmpty(errors)
	};
};
