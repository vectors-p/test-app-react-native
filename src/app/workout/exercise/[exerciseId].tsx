import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  addExerciseToSession,
  getRecommendation,
  logSet,
} from "../../../services/api";
import { getToken } from "../../../services/auth";
import ScreenAppBar from "../../components/ScreenAppBar";

export default function ExerciseLogging() {
  const { exerciseId, sessionId } = useLocalSearchParams<{
    exerciseId: string;
    sessionId: string;
  }>();

  const insets = useSafeAreaInsets();

  const [recommendation, setRecommendation] = useState<{
    reps: number;
    weight: number | null;
    reason: string;
  } | null>(null);

  const [sessionExerciseId, setSessionExerciseId] = useState<number | null>(
    null,
  );

  type LoggedSet = {
    reps: number;
    weight: number;
  };

  const [loggedSets, setLoggedSets] = useState<LoggedSet[]>([]);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();

      if (!token) return;

      const [rec, sessionExercise] = await Promise.all([
        getRecommendation(token, Number(exerciseId)),
        addExerciseToSession(token, Number(sessionId), Number(exerciseId)),
      ]);

      setRecommendation(rec);
      setSessionExerciseId(sessionExercise.id);
      setWeight(rec.weight ? String(rec.weight) : "");
      setReps(String(rec.reps));
      setLoading(false);
    })();
  }, [exerciseId, sessionId]);

  async function handleLogSet() {
    if (!reps || !weight || !sessionExerciseId) return;

    const token = await getToken();

    if (!token) return;

    const set = await logSet(
      token,
      sessionExerciseId,
      Number(reps),
      Number(weight),
    );

    setLoggedSets((prev) => [
      ...prev,
      {
        reps: set.reps,
        weight: Number(set.weight),
      },
    ]);
  }

  function handleFinishExercise() {
    router.push({
      pathname: "/workout/exercise-done",
      params: { sessionId },
    });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenAppBar title="Log exercise" />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenAppBar title="Log exercise" />

      <View style={styles.content}>
        <View style={styles.recBox}>
          <Text style={styles.recText}>{recommendation?.reason}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <TextInput
            style={styles.input}
            placeholder="Reps"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />

          <Pressable style={styles.addButton} onPress={handleLogSet}>
            <Text style={styles.addButtonText}>Log Set</Text>
          </Pressable>
        </View>

        <FlatList
          data={loggedSets}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <Text style={styles.setRow}>
              Set {index + 1}: {item.weight}kg × {item.reps}
            </Text>
          )}
          style={styles.setList}
          contentContainerStyle={styles.setListContent}
        />

        <View
          style={[
            styles.finishButtonContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable style={styles.finishButton} onPress={handleFinishExercise}>
            <Text style={styles.finishButtonText}>Done with this exercise</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  recText: {
    fontSize: 15,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  setList: {
    flex: 1,
    marginTop: 16,
  },
  setListContent: {
    paddingBottom: 16,
  },
  setRow: {
    fontSize: 15,
    paddingVertical: 6,
    color: "#374151",
  },
  finishButtonContainer: {
    paddingTop: 12,
  },
  finishButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  finishButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
