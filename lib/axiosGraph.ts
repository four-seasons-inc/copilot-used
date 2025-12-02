// lib/axiosGraph.ts
import axios, { AxiosHeaders } from "axios";
import { getAppToken } from "./msal";

export const graph = axios.create({
  baseURL: "https://graph.microsoft.com",
});

graph.interceptors.request.use(
  async (config) => {
    const token = await getAppToken();
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers as any);
    }

    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    (config.headers as AxiosHeaders).set("Accept", "application/json");
    (config.headers as AxiosHeaders).set("ConsistencyLevel", "eventual");

    return config;
  },
  (error) => Promise.reject(error)
);
