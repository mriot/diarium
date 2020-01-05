import moment from "moment";

export const fetchHolidays = (year = moment().year(), countryCode = "HE") => {
	if (localStorage.getItem(`holidays_${year}`)) {
		return new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(localStorage.getItem(`holidays_${year}`)));
			} catch (error) {
				reject(error);
			}
		});
	}

	return fetch(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${countryCode}`, {
		method: "GET",
	})
		.then(response => response.json())
		.then(response => {
			const holidays = {};
			// eslint-disable-next-line no-restricted-syntax
			for (const key in response) {
				if (Object.prototype.hasOwnProperty.call(response, key)) {
					holidays[response[key].datum] = key;
				}
			}

			localStorage.setItem(`holidays_${year}`, JSON.stringify(holidays));

			return holidays;
		});
};
