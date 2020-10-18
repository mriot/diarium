import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const createNewEntry = newBodyObj => {
  return fetch(`${BACKEND_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(newBodyObj)
  })
    .then(response => response.json().then(json => ({ ok: response.ok, body: json })))
    .catch(error => console.error(error));
};

export const updateExistingEntryById = (id, newBodyObj) => {
  return fetch(`${BACKEND_URL}/entries?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(newBodyObj)
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

export const deleteEntryById = id => {
  return fetch(`${BACKEND_URL}/entries?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};
