import axios from "axios";
import * as Sentry from '@sentry/react';

// eslint-disable-next-line @typescript-eslint/dot-notation
const VITE_LOGIN_API_URL = import.meta.env["VITE_LOGIN_API_URL"] as string;

export const loginClient = {
 
  async signIn(username: string, password: string): Promise<string> {
    try{
      const response = await axios.post(VITE_LOGIN_API_URL, {
      username,
      password,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data; // JWT token string
    }catch(error:unknown){
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      Sentry.captureException(error);
      throw error;
    }
    
  }
};
