import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProgressExercise = {
  name: string;
  progress: string;
};

type RecentProgressCardProps = {
  exercises: ProgressExercise[];
};

export default function RecentProgressCard({
  exercises,
}: RecentProgressCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent Progress</Text>

      <View style={styles.list}>
        {exercises.slice(0, 4).map((exercise, index) => (
          <View
            key={exercise.name}
            style={[
              styles.exercise,
              index !== Math.min(exercises.length, 4) - 1 &&
                styles.exerciseBorder,
            ]}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            <Text style={styles.progress}>{exercise.progress}</Text>
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

  progress: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
    marginLeft: 12,
  },
});
