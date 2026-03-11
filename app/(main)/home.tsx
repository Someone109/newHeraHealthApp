import HomeScreen from "@/components/home/HomeScreen";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeScreenStart() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
