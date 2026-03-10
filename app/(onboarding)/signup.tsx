import SignUpScreen from "@/components/account/SignUp";
import { Stack } from "expo-router";

export default function SignupRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Sign Up", headerShown: true }} />
      <SignUpScreen />
    </>
  );
}
