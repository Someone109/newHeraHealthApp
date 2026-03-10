import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import Colors from "@/constants/Colors";
import { authClient, AuthErrorCode } from "@/lib/auth";
import { isValidEmail, isValidPassword } from "@/lib/validation";
import { useRouter } from "expo-router";
import { Text, View } from "../Themed";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginError = (error: string | undefined) => {
    if (!error) error = "Unknown Error! (Please try again)";
    setErrorMessage(error);
  };

  const doesAccountExist = async () => {
    setIsLoading(true);
    console.log("Email login attempt:", email);

    //intentionally make a fake request to check if the email exists
    try {
      const url = new URL(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/accountExists`,
      );
      url.searchParams.append("email", email);

      type responseType = {
        exists: boolean;
        isSocial: boolean;
        provider: string;
      };

      const res = await fetch(url);
      if (res.status != 200) {
        setErrorMessage("Check connection and try again!");
        return;
      }
      const json = (await res.json()) as responseType;
      if (!json.exists) {
        router.push("/signup");
        return;
      } else if (json.isSocial) {
        setErrorMessage(`Please login with ${json.provider}`);
      } else {
        setIsPasswordVisible(true);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown Error";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Email is not valid!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    if (!isPasswordVisible) {
      await doesAccountExist();
    } else {
      if (!isValidPassword(password)) {
        setErrorMessage("Password must be at least 8 characters!");
        return;
      }

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        handleLoginError(error.message);
      } else {
        console.log("Login successful", data);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    console.log("Google login clicked");
    setErrorMessage("");
    const { data, error } = await authClient.signIn.social({
      provider: "google",
    });

    const errorCode = error?.code as AuthErrorCode | undefined;

    if (errorCode === "USER_NOT_FOUND" || errorCode === "ACCOUNT_NOT_FOUND") {
      console.log("Redirect to signup");
    } else {
      handleLoginError(error?.message);
    }

    if (data) {
      //redirect to homepage
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/herahealth-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text
        style={styles.title}
        lightColor="rgba(0,0,0,0.85)"
        darkColor="rgba(255,255,255,0.9)"
      >
        Log in to HeraHealth
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="rgba(0,0,0,0.4)"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => {
          setEmail(text.trim());
          if (isPasswordVisible) setIsPasswordVisible(false);
          if (errorMessage) setErrorMessage("");
        }}
        value={email}
      />

      {isPasswordVisible && (
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="rgba(0,0,0,0.4)"
          autoCapitalize="none"
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text.trim());
            if (errorMessage) setErrorMessage("");
          }}
          value={password}
        />
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : isPasswordVisible ? "Log in" : "Continue"}
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Login Providers */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
        >
          <Image
            source={require("@/assets/images/google-icon.svg")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Add more providers here easily */}
        {/* <TouchableOpacity style={styles.socialButton}>...</TouchableOpacity> */}
      </View>
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
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  button: {
    backgroundColor: Colors.herahealthAccent,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 28,
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
  },
  socialContainer: {
    width: "100%",
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
  },
});
