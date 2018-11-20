const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateHeatInput(data) {
	let errors = {};

	data.heat_number = !isEmpty(data.heat_number) ? data.heat_number : "";
	data.date = !isEmpty(data.date) ? data.date : "";
	data.time = !isEmpty(data.time) ? data.time : "";

	if (
		!Validator.isLength(data.heat_number, {
			min: 3,
			max: 30
		})
	) {
		errors.heat_number = "heat_number must be between 3 and 30 characters";
	}

	if (Validator.isEmpty(data.heat_number)) {
		errors.heat_number = "heat_number field is required";
	}

	if (Validator.isEmpty(data.date)) {
		errors.date = "Date field is required";
	}

	if (Validator.isEmpty(data.time)) {
		errors.time = "Time field is required";
	}

	return {
		errors: errors,
		isValid: isEmpty(errors)
	};
};
