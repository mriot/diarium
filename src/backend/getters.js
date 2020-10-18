import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const getRecordsInRange = (start, end, columns) => {
  const params = (columns.map(col => `column=${col}`).join("&"));

  return fetch(`${BACKEND_URL}/entries/range/?start=${start}&end=${end}&${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const getAllEntriesForYear = year => {
  return fetch(`${BACKEND_URL}/entries/${year}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const getAllEntriesForYearMonth = (year, month) => {
  return fetch(`${BACKEND_URL}/entries/${year}/${month}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const getRecordForDay = (year, month, day) => {
  return fetch(`${BACKEND_URL}/entries/${year}/${month}/${day}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
