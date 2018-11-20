const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateScoreInput(data) {
	let errors = {};

	data.first_position = !isEmpty(data.first_position) ? data.first_position : "";
	data.second_position = !isEmpty(data.second_position) ? data.second_position : "";
	data.third_position = !isEmpty(data.third_position) ? data.third_position : "";
	data.fourth_position = !isEmpty(data.fourth_position) ? data.fourth_position : "";
	data.fifth_position = !isEmpty(data.fifth_position) ? data.fifth_position : "";
	data.sixth_position = !isEmpty(data.sixth_position) ? data.sixth_position : "";

	if (Validator.isEmpty(data.first_position)) {
		errors.first_position = "first_position field is required";
	}

	if (Validator.isEmpty(data.second_position)) {
		errors.second_position = "second_position field is required";
	}

	if (Validator.isEmpty(data.third_position)) {
		errors.third_position = "third_position field is required";
	}

	if (Validator.isEmpty(data.fourth_position)) {
		errors.fourth_position = "fourth_position field is required";
	}

	if (Validator.isEmpty(data.fifth_position)) {
		errors.fifth_position = "fifth_position field is required";
	}

	if (Validator.isEmpty(data.sixth_position)) {
		errors.sixth_position = "sixth_position field is required";
	}

	return {
		errors: errors,
		isValid: isEmpty(errors)
	};
};
