import { BACKEND_URL, getToken } from "./_main";
import axios from "axios";
import dayjs from "dayjs";

export const uploadFile = (date, formdata) => {
  const fDate = dayjs(date).format("YYYY/MM/DD");
  return axios.post(`${BACKEND_URL}/entries/uploads/${fDate}`, formdata, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).catch(error => error.response);
};
