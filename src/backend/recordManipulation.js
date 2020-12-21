import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const createNewEntry = recordData => {
  return axios.post(`${BACKEND_URL}/entries`, recordData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};

export const updateExistingEntryById = (id, recordData) => {
  return axios.put(`${BACKEND_URL}/entries?id=${id}`, recordData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};

export const deleteEntryById = id => {
  return axios.delete(`${BACKEND_URL}/entries?id=${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};
