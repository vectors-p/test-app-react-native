import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getSession } from "../../services/api";
import { getToken } from "../../services/auth";
import ScreenAppBar from "../components/ScreenAppBar";

type SessionExercise = {
  name: string;
  sets: { reps: number; weight: number }[];
};

export default function SessionSummary() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    const token = await getToken();

    if (!token) return;

    try {
      const data = await getSession(token, Number(sessionId));
      setExercises(data.exercises);
    } catch (err) {
      console.log("Failed to load session summary:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <ScreenAppBar title="This workout" onBackPress={() => router.back()} />

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item, i) => `${item.name}-${i}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No exercises logged yet in this session.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.exerciseName}>{item.name}</Text>

              <View style={styles.chipRow}>
                {item.sets.map((s, j) => (
                  <View key={j} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {s.weight}kg × {s.reps}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(16, insets.bottom),
          },
        ]}
      >
        <Pressable style={styles.continueButton} onPress={() => router.back()}>
          <Text style={styles.continueButtonText}>Continue workout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  loading: {
    marginTop: 40,
  },

  list: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },

  empty: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
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

  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  continueButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
