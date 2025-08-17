import axios, { AxiosInstance } from "axios";
import { API_BASE_URL, API_ORIGIN } from "../config/env";

type HttpOptions = {
  baseURL?: string;
  origin?: string;
  timeoutMs?: number;
};

export function createHttp({
  baseURL = API_BASE_URL,
  origin = API_ORIGIN,
  timeoutMs = 10000,
}: HttpOptions = {}): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: timeoutMs,

  });
  instance.defaults.headers.common["Origin"] = origin;
  instance.interceptors.response.use(
    (res: any) => res,
    (err: { response: { status: any; data: { message: any } } }) => {
      const status = err?.response?.status;
      return Promise.reject({
        status,
        message: err?.response?.data?.message ?? "Erro na requisição",
        data: err?.response?.data,
      });
    }
  );

  return instance;
}

export const http = createHttp();
