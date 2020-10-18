import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const search = query => {
  return fetch(`${BACKEND_URL}/entries/search?q=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
