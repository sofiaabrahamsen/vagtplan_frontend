import { axiosInstance } from "./api-client";

// eslint-disable-next-line @typescript-eslint/dot-notation
const VITE_LOGIN_API_URL = import.meta.env["VITE_LOGIN_API_URL"] as string;

export const loginClient = {
   // eslint-disable-next-line @typescript-eslint/require-await
   async signIn(username: string, password: string): Promise<string> {
   const response = axiosInstance.post(VITE_LOGIN_API_URL, {
      username,
      password,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return (await response).data.role;
}

}