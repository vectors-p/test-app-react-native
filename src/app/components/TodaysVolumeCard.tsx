import React from "react";
import { StyleSheet, Text, View } from "react-native";

type TodaysVolumeCardProps = {
  workouts: number;
  sets: number;
  weight: number;
};

export default function TodaysVolumeCard({
  workouts,
  sets,
  weight,
}: TodaysVolumeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's Volume</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.value}>{workouts}</Text>
          <Text style={styles.label}>Workouts</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.value}>{sets}</Text>
          <Text style={styles.label}>Sets</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.value}>{weight}</Text>
          <Text style={styles.label}>Weight</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
});
