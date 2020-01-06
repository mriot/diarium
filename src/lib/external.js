import moment from "moment";

export const fetchHolidays = (year = moment().year(), countryCode = "HE") => {
	const NAME_TEMPLATE = `holidays_${countryCode}_${year}`;

	if (localStorage.getItem(NAME_TEMPLATE)) {
		return new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(localStorage.getItem(NAME_TEMPLATE)));
			} catch (error) {
				localStorage.removeItem(NAME_TEMPLATE);
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

			localStorage.setItem(NAME_TEMPLATE, JSON.stringify(holidays));

			return holidays;
		});
};
