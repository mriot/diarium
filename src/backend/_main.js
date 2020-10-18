import dayjs from "dayjs";
import moment from "moment";

export const BACKEND_URL = "http://localhost:5000/api";

let TOKEN = null;
export const getToken = () => TOKEN;
export const setToken = value => {
  TOKEN = value;
};
