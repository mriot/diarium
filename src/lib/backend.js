import jwt from "jsonwebtoken";
import moment from "moment";

// GLOBALS ====================================================
const BACKEND_URL = "http://localhost:5000/api";
let GLOBAL_TOKEN = null;


// LOGIN / AUTH ====================================================
export const auth = (username, password) => {
	return fetch(`${BACKEND_URL}/auth`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username, password })
	}).then(response => {
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
		});
};

export const isLoggedIn = () => {
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


// COUNT ALL ====================================================
export const countAllEntries = () => {
	return fetch(`${BACKEND_URL}/entries/count/`, {
		method: "GET"
	})
		.then(response => response.json());
};


// GET ====================================================
export const getAllEntriesForYear = year => {
	return fetch(`${BACKEND_URL}/entries/${year}/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${GLOBAL_TOKEN}`
		},
	})
		.then(response => response.json());
};

export const getAllEntriesForYearMonth = (year, month) => {
	return fetch(`${BACKEND_URL}/entries/${year}/${month}/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${GLOBAL_TOKEN}`
		},
	})
		.then(response => response.json());
};
