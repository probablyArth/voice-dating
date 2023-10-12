import axios from "axios";
import config from "../config";

const interceptor = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

interceptor.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err?.response?.data.cause === "accessToken") {
      try {
        await interceptor.post("/api/refresh");
        return interceptor(originalRequest);
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error(err?.response?.data?.message);
    }
  }
);

export const sendOtp = (data) => interceptor.post("/api/send-otp", data);
export const verifyOtp = (data) => interceptor.post("/api/verify-otp", data);
export const activate = (data) => interceptor.post("/api/activate", data);
export const getUser = () => interceptor.get("/api/user");
export const getUserById = (userId) => interceptor.get(`/api/user/${userId}`);
export const logout = () => interceptor.post("/api/logout");
export const updateBio = (data) => interceptor.patch("/api/bio", data);
export const updateAvatar = (data) => interceptor.patch("/api/avatar", data);
export const deleteUser = () => interceptor.delete("/api/user");
export const fetchRooms = () => interceptor.get("/api/room");
export const postCreateRoom = (name) => interceptor.post("/api/room", { name });
export const getAuthToken = (hmsRoomId) =>
  interceptor.post("/api/room/token", { hmsRoomId });
export const getUserIdFromRoomId = (roomId) =>
  interceptor.get(`/api/room/${roomId}`);
export const getCount = (hmsRoomId) =>
  interceptor.post("/api/room/count", { hmsRoomId });

export default interceptor;
