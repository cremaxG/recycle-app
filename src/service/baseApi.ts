import { storage } from "../utils/Storage";
import axiosInstance from "./axiosInstance";

// const apiBaseUrl = "https://water-drop-backend.onrender.com/api/v1";

const handleError = (error: any) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      // storage.clear();
      // window.location.href = "./signup";
    } else if (status === 403 || status === 404) {
      return error.response.data;
    }
    return error.response.data;
  }
  return error;
};

export default class BaseApi {
  // static setAccessToken(token: string) {
  //   localStorage.setItem("accessToken", token);
  //   window.dispatchEvent(new Event("authChanged"));
  // }

  static getHeaders(extraHeaders = {}) {
    const token = storage.getString('authToken')

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    };
  }

  static camelToSnake(str: string) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  static async get(endpoint: string, extraHeaders = {}, config = {}) {
    try {
      const res = await axiosInstance.get(`${endpoint}`, {
        headers: this.getHeaders(extraHeaders),
        ...config
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async post(endpoint: string, payload: any, extraHeaders = {}, config = {}) {
    try {
      const res = await axiosInstance.post(`${endpoint}`, payload, {
        headers: this.getHeaders(extraHeaders),
        ...config
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async put(endpoint: string, payload: any, extraHeaders = {}, config = {}) {
    try {
      const res = await axiosInstance.put(`${endpoint}`, payload, {
        headers: this.getHeaders(extraHeaders),
        ...config
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  }

    static async patch(endpoint: string, payload: any, extraHeaders = {}, config = {}) {
    try {
      const res = await axiosInstance.patch(`${endpoint}`, payload, {
        headers: this.getHeaders(extraHeaders),
        ...config
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async delete(endpoint: string, extraHeaders = {}, config = {}) {
    try {
      const res = await axiosInstance.delete(`${endpoint}`, {
        headers: this.getHeaders(extraHeaders),
        ...config
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
