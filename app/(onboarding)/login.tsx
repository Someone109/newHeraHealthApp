import LoginScreen from "@/components/account/LoginScreen";
import { Stack } from "expo-router";

export default function LoginRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Login", headerShown: true }} />
      <LoginScreen />
    </>
  );
}
