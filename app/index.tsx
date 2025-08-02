import {
  Canvas,
  Circle,
  ColorShader,
  Group,
  Mask,
  Paint,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Switch, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");
const NUM_COLORS = 2;

const ConditionalMask = ({
  isEnabled,
  children,
}: {
  isEnabled: boolean;
  children: React.ReactNode;
}) => {
  if (!isEnabled) {
    return <>{children}</>;
  }
  return (
    <Mask
      mode="alpha"
      mask={
        <Circle
          key="rs"
          cx={width / 2}
          cy={height / 2}
          r={Math.min(width / 2, height / 2)}
        >
          <ColorShader color="white" />
        </Circle>
      }
    >
      {children}
    </Mask>
  );
};

export default function Index() {
  const [isEnabled, setIsEnabled] = useState(false);

  const colorBlobs = useMemo(() => {
    const hues = [
      [0, 255, 0],
      [255, 0, 0],
    ];

    const positions = [
      [width / 2, height / 2],
      [width / 5, height / 2],
    ];

    return Array.from({ length: NUM_COLORS }).map((_, i) => {
      const centerX = positions[i][0];
      const centerY = positions[i][1];
      const radius = width * 0.5;
      return {
        id: `color-${i}`,
        cx: centerX,
        cy: centerY,
        radius,
        color: hues[i % hues.length],
      };
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Canvas
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ConditionalMask isEnabled={isEnabled}>
          <Group>
            {colorBlobs.map((blob) => (
              <Circle key={blob.id} cx={blob.cx} cy={blob.cy} r={blob.radius}>
                <RadialGradient
                  c={vec(blob.cx, blob.cy)}
                  r={blob.radius}
                  colors={[
                    `rgba(${blob.color[0]},${blob.color[1]},${blob.color[2]},1)`,
                    `rgba(${blob.color[0]},${blob.color[1]},${blob.color[2]},0)`,
                  ]}
                />
              </Circle>
            ))}
          </Group>
        </ConditionalMask>

        {!isEnabled && (
          <Circle
            style="stroke"
            key="rs"
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width / 2, height / 2)}
          >
            <Paint color="#000000" style="stroke" strokeWidth={1} />
          </Circle>
        )}
      </Canvas>

      {/* Controls overlay */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.label}>Toggle Mask</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
        </View>
        <Text style={styles.statusText}>
          Status: {isEnabled ? "Enabled" : "Disabled"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    width: 200,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 15,
    zIndex: 1000,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
