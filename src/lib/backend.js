import { decode } from "jsonwebtoken";

// GLOBALS
const BACKEND_URL = "http://localhost:5000/api";
const GLOBAL_TOKEN = null;


export const countAllEntries = () => {
	return fetch(`${BACKEND_URL}/entries/count/`, {
		method: "GET"
	})
		.then(response => response.json());
};
