const helper = module.exports;

helper.isValidPositiveInteger = function (value) {
	if (value !== null && value !== undefined && typeof (value) === 'number' && value >= 0 && value <= 2147483647 && value === value) {
		return true;
	}
	return false;
};

helper.isValidPositiveIntegerIfExists = function (value) {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof (value) === 'number' && value >= 0 && value < 2147483647 && value === value) {
		return true;
	}
	return false;
};

helper.isValidString = function (value) {
	if (value !== null && value !== undefined && typeof (value) === 'string' && value.length !== 0) {
		return true;
	}
	return false;
};

helper.isValidStringIfExists = function (value) {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof (value) === 'string' && value.length !== 0) {
		return true;
	}
	return false;
};
