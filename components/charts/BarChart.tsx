import { colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../Themed";

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
/** Simple bar chart rendered with plain Views */
export function BarChart({
  data,
  barColor = colors.accentLight,
}: {
  data: { label: string; value: number }[];
  barColor?: string;
}) {
  const MAX_HEIGHT = 80;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={barStyles.wrapper}>
      {/* Y-axis labels */}
      <View style={barStyles.yAxis}>
        {[20, 15, 10, 5, 0].map((v) => (
          <Text key={v} style={barStyles.yLabel}>
            {v}
          </Text>
        ))}
      </View>

      {/* Bars + X labels */}
      <View style={barStyles.barsArea}>
        <View style={barStyles.barsRow}>
          {data.map((d, i) => (
            <View key={i} style={barStyles.barWrapper}>
              <View
                style={[
                  barStyles.bar,
                  {
                    height: Math.max(4, (d.value / maxValue) * MAX_HEIGHT),
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
          ))}
        </View>
        {/* X-axis line */}
        <View style={barStyles.xLine} />
        <View style={barStyles.xLabels}>
          {data.map((d, i) => (
            <Text key={i} style={barStyles.xLabel}>
              {d.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
const barStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  yAxis: {
    height: 100,
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginRight: 4,
    paddingBottom: 16,
  },
  yLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  barsArea: {
    flex: 1,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    marginBottom: 0,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 80,
  },
  bar: {
    width: 18,
    borderRadius: 4,
  },
  xLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginTop: 2,
  },
  xLabels: {
    flexDirection: "row",
    marginTop: 3,
  },
  xLabel: {
    flex: 1,
    fontSize: 8,
    color: colors.textMuted,
    textAlign: "center",
  },
});
