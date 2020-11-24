import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const createNewEntry = recordData => {
  try {
    return axios.post(`${BACKEND_URL}/entries`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      data: recordData
    });
  } catch (error) {
    return error.response;
  }
};

export const updateExistingEntryById = (id, recordData) => {
  try {
    return axios.put(`${BACKEND_URL}/entries?id=${id}`, {
      data: recordData
    }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};

export const deleteEntryById = id => {
  try {
    return axios.delete(`${BACKEND_URL}/entries?id=${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};
