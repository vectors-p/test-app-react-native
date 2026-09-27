import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSessions } from "../../services/api";
import { getToken } from "../../services/auth";

type Session = {
  id: number;
  date: string;
  muscle_groups: string[];
  exercises: {
    name: string;
    sets: { reps: number; weight: number }[];
  }[];
};

export default function History() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      try {
        const data = await getSessions(token);
        setSessions(data);
      } catch (err) {
        console.log("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.title}>Workout History</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No workouts logged yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.muscleGroups}>
                {item.muscle_groups.join(" & ")}
              </Text>
            </View>

            {item.exercises.map((ex, i) => (
              <View key={i} style={styles.exerciseBlock}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.setsLine}>
                  {ex.sets
                    .map((s) => `${s.weight}kg × ${s.reps}`)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 16 },
  list: { paddingBottom: 24 },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 40 },
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
  date: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  muscleGroups: { fontSize: 14, color: "#2563EB", fontWeight: "700" },
  exerciseBlock: { marginBottom: 8 },
  exerciseName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  setsLine: { fontSize: 13, color: "#6B7280", marginTop: 2 },
});