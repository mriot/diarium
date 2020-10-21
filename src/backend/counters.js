import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const countAllEntries = () => {
  try {
    return axios.get(`${BACKEND_URL}/entries/count/`);
  } catch (error) {
    return error.response;
  }
};

export const countRecordsInRange = async (start, end) => {
  try {
    return axios.get(`${BACKEND_URL}/entries/range/count/?start=${start}&end=${end}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};
