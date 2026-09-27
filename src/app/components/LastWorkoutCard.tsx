import { StyleSheet, Text, View } from "react-native";

type LastWorkoutCardProps = {
  workout: string;
};

export default function LastWorkoutCard({ workout }: LastWorkoutCardProps) {
  const isEmpty = !workout || workout === "No workouts yet";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Last Workout</Text>
      <Text style={[styles.workout, isEmpty && styles.emptyText]}>
        {isEmpty ? "No workouts logged yet — let's fix that!" : workout}
      </Text>
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

  workout: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#9CA3AF",
  },
});
