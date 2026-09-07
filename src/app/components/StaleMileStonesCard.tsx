import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Exercise = {
  name: string;
  weeks: number;
};

type StaleMilestonesCardProps = {
  exercises: Exercise[];
};

export default function StaleMilestonesCard({
  exercises,
}: StaleMilestonesCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Needs Attention</Text>

      <View style={styles.list}>
        {exercises.slice(0, 4).map((exercise, index) => (
          <View
            key={exercise.name}
            style={[
              styles.exercise,
              index !== exercises.length - 1 && styles.exerciseBorder,
            ]}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            <Text style={styles.weeks}>
              {exercise.weeks} {exercise.weeks === 1 ? "week" : "weeks"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
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
    marginBottom: 12,
  },

  list: {
    width: "100%",
  },

  exercise: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  exerciseBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  exerciseName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  weeks: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 12,
  },
});
