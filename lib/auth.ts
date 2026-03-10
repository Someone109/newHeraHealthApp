import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}`,
});

export type AuthErrorCode = keyof typeof authClient.$ERROR_CODES;
