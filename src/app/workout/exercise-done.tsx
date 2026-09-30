import { finishSession } from "@/services/api";
import { getToken } from "@/services/auth";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ExerciseDone() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  function handleAddAnother() {
    router.push({
      pathname: "/workout" as any,
      params: { sessionId },
    });
  }

  async function handleFinishWorkout() {
    const token = await getToken();
    if (!token || !sessionId) {
      router.replace("/home");
      return;
    }

    const result = await finishSession(token, Number(sessionId));

    if (!result.success) {
      Alert.alert("No workout saved", result.message);
    }

    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nice work! 💪</Text>
      <Text style={styles.subtitle}>What's next?</Text>

      <Pressable style={styles.primaryButton} onPress={handleAddAnother}>
        <Text style={styles.primaryButtonText}>Add another exercise</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleFinishWorkout}>
        <Text style={styles.secondaryButtonText}>Finish workout</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          router.push({
            pathname: "/workout/session-summary",
            params: { sessionId },
          })
        }
      >
        <Text style={styles.secondaryButtonText}>View this workout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
  },
});
