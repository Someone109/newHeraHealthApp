import { createAuthClient } from "better-auth/client";
import { useRouter } from "expo-router";

export const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}`,
});

export type AuthErrorCode = keyof typeof authClient.$ERROR_CODES;

export async function redirectAuthSession(shouldBeLoggedIn: boolean) {
  const router = useRouter();
  const { data, error } = await authClient.getSession();
  if (shouldBeLoggedIn) {
    if (!data || error) {
      router.push("/login");
    }
  } else {
    if (data) {
      router.push("/home");
    }
  }
}
