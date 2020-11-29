import jwt from "jsonwebtoken";
import moment from "moment";
import { fetch2 } from "../src/lib/fetchWithTimeout";

// GLOBALS ====================================================
const BACKEND_URL = "http://localhost:5000/api";
const GLOBAL_TOKEN = null;

// ====================================================

// ! MOVED
/*
// LOGIN / AUTH ====================================================
export const auth = (username, password) => {
  return fetch(`${BACKEND_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      return response.json();
    })
    .then(response => {
      // console.log(jwt.decode(response.token, { complete: true }));
      localStorage.setItem("token", response.token);
      GLOBAL_TOKEN = response.token;
      return response;
    })
    .catch(error => console.error(error));
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  if (!token || !decodedToken) return false;
  if (!decodedToken.exp || decodedToken.exp <= moment().unix()) {
    localStorage.removeItem("token");
    return false;
  }
  GLOBAL_TOKEN = token;
  return true;
};
*/

// ! MOVED
/*
// COUNT ALL ====================================================
export const countAllEntries = () => {
  return fetch(`${BACKEND_URL}/entries/count/`, {
    method: "GET"
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
*/

// ! MOVED
/*
// GET ====================================================
export const getRecordsInRange = (start, end, columns) => {
  const params = (columns.map(col => `column=${col}`).join("&"));

  return fetch(`${BACKEND_URL}/entries/range/?start=${start}&end=${end}&${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const countRecordsInRange = (start, end) => {
  return fetch(`${BACKEND_URL}/entries/range/count/?start=${start}&end=${end}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
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
      Authorization: `Bearer ${GLOBAL_TOKEN}`
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
      Authorization: `Bearer ${GLOBAL_TOKEN}`
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
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
*/

// ! MOVED
/*
// SEARCH ====================================================
export const search = query => {
  return fetch(`${BACKEND_URL}/entries/search?q=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
*/

// ! MOVED
/*
// POST ====================================================
export const createNewEntry = newBodyObj => {
  return fetch(`${BACKEND_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    },
    body: JSON.stringify(newBodyObj)
  })
    .then(response => response.json().then(json => ({ ok: response.ok, body: json })))
    .catch(error => console.error(error));
};

// PUT ====================================================
export const updateExistingEntryById = (id, newBodyObj) => {
  return fetch(`${BACKEND_URL}/entries?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    },
    body: JSON.stringify(newBodyObj)
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

// DELETE ====================================================
export const deleteEntryById = id => {
  return fetch(`${BACKEND_URL}/entries?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLOBAL_TOKEN}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
*/