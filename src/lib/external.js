import dayjs from "dayjs";

export const fetchHolidays = (year = dayjs().year()) => {
  const countryCode = localStorage.getItem("federal_state") || "HE";
  const holidayNameTemplate = `holidays_${countryCode}_${year}`;

  if (localStorage.getItem(holidayNameTemplate)) {
    return new Promise((resolve, reject) => {
      try {
        resolve(JSON.parse(localStorage.getItem(holidayNameTemplate)));
      } catch (error) {
        localStorage.removeItem(holidayNameTemplate);
        reject(error);
      }
    });
  }

  return fetch(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${countryCode}`, {
    method: "GET"
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

      localStorage.setItem(holidayNameTemplate, JSON.stringify(holidays));

      return holidays;
    });
};
