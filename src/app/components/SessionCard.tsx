import React from "react";
import { StyleSheet, Text, View } from "react-native";

type SessionExercise = {
  name: string;
  sets: { reps: number; weight: number }[];
};

type SessionCardProps = {
  date: string;
  muscleGroups: string[];
  exercises: SessionExercise[];
};

export default function SessionCard({
  date,
  muscleGroups,
  exercises,
}: SessionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.muscleGroups}>{muscleGroups.join(" & ")}</Text>
      </View>

      {exercises.map((ex, i) => (
        <View key={i} style={styles.exerciseBlock}>
          <Text style={styles.exerciseName}>{ex.name}</Text>
          <Text style={styles.setsLine}>
            {ex.sets.map((s) => `${s.weight}kg × ${s.reps}`).join(", ")}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  muscleGroups: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
  },
  exerciseBlock: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  setsLine: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});