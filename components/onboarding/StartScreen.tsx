import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Text, View } from "../Themed";

export default function StartScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        lightColor="rgba(0,0,0,0.85)"
        darkColor="rgba(255,255,255,0.9)"
      >
        Welcome to HeraHealth
      </Text>

      <Text
        style={styles.subtitle}
        lightColor="rgba(0,0,0,0.7)"
        darkColor="rgba(255,255,255,0.7)"
      >
        Providing women with a life-changing device, in the palm of their hand.
      </Text>

      <Image
        source={require("@/assets/images/herahealth-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.herahealthAccent,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    cursor: "pointer",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
