import { Ionicons } from "@expo/vector-icons";
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SessionCard({
  date,
  muscleGroups,
  exercises,
}: SessionCardProps) {
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <Text style={styles.muscleGroups}>{muscleGroups.join(" & ")}</Text>
        </View>


      </View>

      <View style={styles.divider} />

      {exercises.map((ex, i) => (
        <View
          key={i}
          style={[
            styles.exerciseBlock,
            i !== exercises.length - 1 && styles.exerciseBorder,
          ]}
        >
          <Text style={styles.exerciseName}>{ex.name}</Text>
          <View style={styles.chipRow}>
            {ex.sets.map((s, j) => (
              <View key={j} style={styles.chip}>
                <Text style={styles.chipText}>
                  {s.weight}kg × {s.reps}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  date: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  muscleGroups: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "700",
  },
  setsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  setsBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  exerciseBlock: {
    paddingBottom: 12,
    marginBottom: 12,
  },
  exerciseBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
});
