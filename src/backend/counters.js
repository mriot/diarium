import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const countAllEntries = () => {
  return axios.get(`${BACKEND_URL}/entries/count/`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};

export const count = (path = "") => {
  return axios.get(`${BACKEND_URL}/entries/count/${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};

export const countRecordsInRange = async (start, end) => {
  return axios.get(`${BACKEND_URL}/entries/range/count/?start=${start}&end=${end}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};
