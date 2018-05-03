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

helper.timeDifferenceString = function (time1, time2, partial=true) {
	const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
	const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;
	const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
	const MS_PER_DAY = 1000 * 60 * 60 * 24;
	const MS_PER_HOUR = 1000 * 60 * 60;
	const MS_PER_MINUTE = 1000 * 60;

	const timeDifference = time2 - time1;

	const Years = Math.round(timeDifference/ MS_PER_YEAR);
	const Months = Math.round((timeDifference%MS_PER_YEAR) / MS_PER_MONTH);
	const Weeks = Math.round (((timeDifference%MS_PER_YEAR)%MS_PER_MONTH) / MS_PER_WEEK);
	const Days = Math.round ((((timeDifference%MS_PER_YEAR)%MS_PER_MONTH)%MS_PER_WEEK) / MS_PER_DAY);
	const Hours = Math.round (((((timeDifference%MS_PER_YEAR)%MS_PER_MONTH)%MS_PER_WEEK)%MS_PER_DAY) / MS_PER_HOUR);
	const Minutes = Math.round ((((((timeDifference%MS_PER_YEAR)%MS_PER_MONTH)%MS_PER_WEEK)%MS_PER_DAY)%MS_PER_HOUR) / MS_PER_MINUTE);

	if (partial) {
		if (Years) {
			return Years + (Years > 1 ? ' Years' : ' Year');
		}
		if (Months) {
			return Months + (Months > 1 ? ' Months' : ' Month');
		}
		if (Weeks) {
			return Weeks + (Weeks > 1 ? ' Weeks' : ' Week');
		}
		if (Days) {
			return Days + (Days > 1 ? ' Days' : ' Day');
		}
		if (Hours) {
			return Hours + (Hours > 1 ? ' Hours' : ' Hour');
		}
		if (Minutes) {
			return Minutes + (Minutes > 1 || Minutes === 0 ? ' Minutes' : ' Minute');
		}
	}
	return (
		(Years ? Years + (Years > 1 ? ' Years, ' : ' Year, ') : '') +
		(Months ? Months + (Months > 1 ? ' Months, ' : ' Month, ') : '') +
		(Weeks ? Weeks + (Weeks > 1 ? ' Weeks, ' : ' Week, ') : '') +
		(Days ? Days + (Days > 1 ? ' Days, ' : ' Day, ') : '') +
		(Hours ? Hours + (Hours > 1 ? ' Hours, ' : ' Hour, ') : '') +
		(Minutes + (Minutes > 1 || Minutes === 0 ? ' Minutes' : ' Minute'))
	);
}
