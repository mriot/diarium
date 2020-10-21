import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const getRecordsInRange = (start, end, columns) => {
  const params = (columns.map(col => `column=${col}`).join("&"));

  try {
    return axios.get(`${BACKEND_URL}/entries/range/?start=${start}&end=${end}&${params}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};

export const getAllEntriesForYear = year => {
  try {
    return axios.get(`${BACKEND_URL}/entries/${year}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};

export const getAllEntriesForYearMonth = (year, month) => {
  try {
    return axios.get(`${BACKEND_URL}/entries/${year}/${month}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};

export const getRecordForDay = (year, month, day) => {
  try {
    return axios.get(`${BACKEND_URL}/entries/${year}/${month}/${day}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};
