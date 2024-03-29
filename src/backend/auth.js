import { BACKEND_URL, setToken } from "./_main";
import axios from "axios";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  if (!token || !decodedToken) return false;
  if (!decodedToken.exp || decodedToken.exp <= dayjs().unix()) {
    localStorage.removeItem("token");
    return false;
  }
  setToken(token);
  return true;
};

export const auth = async (username, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/user/auth`, {
      username,
      password
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    }

    return response;
  } catch (error) {
    return error.response;
  }
};
