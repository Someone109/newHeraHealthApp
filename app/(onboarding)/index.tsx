import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import StartScreen from "@/components/onboarding/StartScreen";

export default function OnboardingStart() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StartScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
