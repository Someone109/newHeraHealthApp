import { colors } from "@/constants/Colors";
import { authClient, redirectAuthSession } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../Themed";
import { BarChart } from "../charts/BarChart";
import { DonutTimer } from "../charts/DonutTimer.";
import { formatTime } from "../../lib/helpers";
import HamburgerMenu from "../ui/HamburgerMenu";

// ─── PLACEHOLDER DATA (swap these for real API data) ─────────────────────────
const DAILY_TOTAL_ML = 355;

// Bar chart: replace with real hourly/session data. Each item: { label, value }
const BAR_DATA = [
  { label: "PlaceHolder 1", value: 5 },
  { label: "PlaceHolder 2", value: 10 },
  { label: "PlaceHolder 3", value: 15 },
  { label: "PlaceHolder 4", value: 20 },
];

// Donut: timeSinceLastPhoto in minutes (e.g. 75 = 01:15)
const TIME_SINCE_LAST_PHOTO_MINUTES = 75;
// Max window for the donut arc (e.g. show progress within a 4-hour window)
const DONUT_MAX_MINUTES = 240;

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  redirectAuthSession(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (data) setName(data.user.name);
    };
    fetchSession();
  }, []);

  const greeting = name ? `Good Morning, ${name}` : "Good Morning";
  const timeLabel = formatTime(TIME_SINCE_LAST_PHOTO_MINUTES);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Purple gradient header ── */}
      <View style={styles.header}>
        <HamburgerMenu/>

        <Text style={styles.headerTitle}>HeraHealth</Text>

        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={26} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        {/* Greeting */}
        <Text style={styles.greeting}>{greeting}</Text>

        {/* Side-by-side cards */}
        <View style={styles.cardsRow}>
          {/* 24 Hour Total */}
          <View style={[styles.card, styles.cardLeft]}>
            <Text style={styles.cardTitle}>24 Hour Total</Text>
            <BarChart data={BAR_DATA} />
            <Text style={styles.totalText}>{DAILY_TOTAL_ML} mL</Text>
          </View>

          {/* Since Last Photo */}
          <View style={[styles.card, styles.cardRight]}>
            <Text style={styles.cardTitle}>Since Last Photo</Text>
            <View style={styles.donutWrapper}>
              <DonutTimer
                minutes={TIME_SINCE_LAST_PHOTO_MINUTES}
                maxMinutes={DONUT_MAX_MINUTES}
                size={110}
                strokeWidth={14}
              />
              <Text style={styles.donutLabel}>{timeLabel}</Text>
            </View>
          </View>
        </View>

        {/* Primary button */}
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Capture New Image</Text>
        </TouchableOpacity>

        {/* Secondary button */}
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
          <Text style={styles.secondaryButtonText}>Blood Loss Metrics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    width: "100%",
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Purple gradient effect using a solid + overlay approach
    backgroundColor: colors.headerTop,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 30,
    color: colors.white,
    fontWeight: "700",
    //fontStyle: "italic",
    letterSpacing: 0.5,
    // The script/cursive look — on device you can swap this for a custom font
    fontFamily: "Nickainley",
  },

  /* Body */
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* Greeting */
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.3,
  },

  /* Cards row */
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    // Subtle teal shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLeft: {
    // slightly more padding for chart breathing room
  },
  cardRight: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    letterSpacing: 0.1,
  },

  /* Bar chart total text */
  totalText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginTop: 4,
  },

  /* Donut */
  donutWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    position: "relative",
  },
  donutLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
  },

  /* Buttons */
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 18,
    borderRadius: 32,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 0.1,
  },
});
