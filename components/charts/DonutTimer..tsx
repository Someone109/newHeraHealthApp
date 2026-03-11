import { colors } from "@/constants/Colors";
import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

/** Donut / arc progress indicator using SVG */
export function DonutTimer({
  minutes,
  maxMinutes,
  size = 100,
  strokeWidth = 12,
  color = colors.accentLight,
}: {
  minutes: number;
  maxMinutes: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const progress = Math.min(minutes / maxMinutes, 1);

  // Draw arc: start at top (-90°), sweep clockwise
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + 2 * Math.PI * progress;

  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy + radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);

  const largeArc = progress > 0.5 ? 1 : 0;
  const arcPath =
    progress >= 1
      ? // Full circle
        `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.001} ${cy - radius} Z`
      : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;

  return (
    <Svg width={size} height={size}>
      {/* Track */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress arc */}
      <Path
        d={arcPath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
