import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { colors } from "@/constants/Colors";
import { authClient, redirectAuthSession } from "@/lib/auth";
import { isValidEmail, isValidPassword, validateName } from "@/lib/validation";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Text, View } from "../Themed";

export default function SignUpScreen({ email: emailProp }: { email?: string }) {
  redirectAuthSession(false);
  const router = useRouter();
  const [email, setEmail] = useState(emailProp);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginError = (error: string | undefined) => {
    if (!error) error = "Unknown Error! (Please try again)";
    setErrorMessage(error);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImage(
          `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`,
        );
      }
    }
  };

  const handleEmailSignup = async () => {
    if (!email || !password || !role || !name) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email!");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Password must be at least 8 characters!");
      return;
    }

    if (!validateName(name)) {
      setErrorMessage("Please enter a valid name!");
      return;
    }

    const imageToUpload = image || "default-pfp";

    setIsLoading(true);
    setErrorMessage("");

    console.log("Signup attempt:", { email, password, role, name });
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        image: imageToUpload,
        name,
        fetchOptions: {
          body: { role },
        },
      });

      if (error) {
        handleLoginError(error.message);
      }

      if (data) {
        router.push("/home");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unexpected Error";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
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
        Create your HeraHealth account
      </Text>

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "patient" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("patient")}
        >
          <Text
            style={[
              styles.roleText,
              role === "patient" && styles.roleTextSelected,
            ]}
          >
            Patient
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "doctor" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("doctor")}
        >
          <Text
            style={[
              styles.roleText,
              role === "doctor" && styles.roleTextSelected,
            ]}
          >
            Doctor
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="rgba(0,0,0,0.4)"
        autoCapitalize="words"
        onChangeText={(text) => {
          setName(text);
          if (errorMessage) setErrorMessage("");
        }}
        value={name}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="rgba(0,0,0,0.4)"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => {
          setEmail(text.trim());
          if (errorMessage) setErrorMessage("");
        }}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Create a password"
        placeholderTextColor="rgba(0,0,0,0.4)"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text.trim());
          if (errorMessage) setErrorMessage("");
        }}
        value={password}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {image ? "Change Profile Picture" : "Upload Profile Picture"}
        </Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity onPress={() => setImage(null)}>
            <Text style={styles.removeImageText}>Remove Picture</Text>
          </TouchableOpacity>
        </View>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Text>
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
  roleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    marginHorizontal: 6,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roleButtonSelected: {
    backgroundColor: colors.herahealthAccent,
    borderColor: colors.herahealthAccent,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(0,0,0,0.7)",
  },
  roleTextSelected: {
    color: "#fff",
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
    backgroundColor: colors.herahealthAccent,
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
  imageButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  imageButtonText: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  removeImageText: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
  },
});
