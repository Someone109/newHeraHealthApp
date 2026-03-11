import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Hamburger from "react-native-hamburger";
import { Text } from "../Themed";

// ─── THEME ───────────────────────────────────────────────────────────────────
const COLORS = {
  menuBg: "#2D8B80", // teal background
  itemBg: "rgba(0,0,0,0.12)", // slightly darker teal for buttons
  itemBorder: "rgba(255,255,255,0.25)",
  text: "#FFFFFF",
  textDisabled: "rgba(255,255,255,0.45)",
  white: "#FFFFFF",
};

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────
// Add/remove items here, or mark as disabled
const MENU_ITEMS: { label: string; route?: string; disabled?: boolean }[] = [
  { label: "Metrics", route: "/metrics" },
  { label: "How to Use HeraHealth", route: "/how-to-use" },
  { label: "Learn More About PPH", route: "/learn-pph" },
  { label: "FAQ", route: "/faq" },
  { label: "Account", route: "/account" },
  { label: "Settings", disabled: true },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const openMenu = () => {
    setOpen(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const handleItemPress = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.disabled) return;
    closeMenu();
    if (item.route) router.push(item.route as any);
  };

  return (
    <>
      {/* Trigger — place this wherever you need the hamburger icon */}
      <Hamburger
        type="cross"
        active={open}
        color={COLORS.white}
        onPress={() => (open ? closeMenu() : openMenu())}
      />

      {/* Full-screen overlay menu */}
      <Modal visible={open} transparent animationType="none">
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <TouchableWithoutFeedback>
              <View style={styles.menu}>
                {/* Top bar: home icon (left) + hamburger/close (right) */}
                <View style={styles.topBar}>
                  <Hamburger
                    type="cross"
                    active={open}
                    color={COLORS.white}
                    onPress={closeMenu}
                  />

                  <TouchableOpacity
                    onPress={closeMenu}
                    style={styles.homeButton}
                  >
                    <Ionicons name="home" size={38} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                {/* Menu items */}
                <View style={styles.itemList}>
                  {MENU_ITEMS.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.item,
                        item.disabled && styles.itemDisabled,
                      ]}
                      onPress={() => handleItemPress(item)}
                      activeOpacity={item.disabled ? 1 : 0.7}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          item.disabled && styles.itemTextDisabled,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.menuBg,
    paddingTop: 25,
    paddingLeft: 22,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Top bar */
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  homeButton: {
    padding: 4,
  },

  /* Items */
  itemList: {
    gap: 16,
  },
  item: {
    backgroundColor: COLORS.itemBg,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: COLORS.itemBorder,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  itemTextDisabled: {
    color: COLORS.textDisabled,
  },
});
