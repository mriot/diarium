import jwt from "jsonwebtoken";

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
			console.log(jwt.decode(response.token, { complete: true }));

			localStorage.setItem("token", response.token);
			GLOBAL_TOKEN = response.token;
			return response;
		});
};

// COUNT ALL ====================================================
export const countAllEntries = () => {
	return fetch(`${BACKEND_URL}/entries/count/`, {
		method: "GET"
	})
		.then(response => response.json());
};
