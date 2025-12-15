import { axiosInstance } from "./api-client";

// eslint-disable-next-line @typescript-eslint/dot-notation
const VITE_LOGIN_API_URL = import.meta.env['VITE_LOGIN_API_URL'] as string;

export const loginClient = {
  async signIn(username: string, password: string): Promise<{ role: string }> {
    const res = await axiosInstance.post<{ role: string }>(VITE_LOGIN_API_URL, {
      username,
      password,
    });
    return res.data;
  },
};
