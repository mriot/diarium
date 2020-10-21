import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";

export const search = query => {
  try {
    return axios.get(`${BACKEND_URL}/entries/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    return error.response;
  }
};
