import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const countAllEntries = () => {
  return fetch(`${BACKEND_URL}/entries/count/`, {
    method: "GET"
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const countRecordsInRange = (start, end) => {
  return fetch(`${BACKEND_URL}/entries/range/count/?start=${start}&end=${end}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
