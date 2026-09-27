import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getExercisesForGroup } from "../../services/api";
import { getToken } from "../../services/auth";
import ScreenAppBar from "../components/ScreenAppBar";

export default function ExerciseList() {
  const { groupId, sessionId } = useLocalSearchParams<{
    groupId: string;
    sessionId: string;
  }>();
  const [exercises, setExercises] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const data = await getExercisesForGroup(token, Number(groupId));
        setExercises(data);
      } catch (err) {
        console.log("Failed to load exercises:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScreenAppBar title="Choose an exercise" />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScreenAppBar title="Choose an exercise" />

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/workout/exercise/[exerciseId]",
                params: { exerciseId: item.id, sessionId },
              })
            }
          >
            <Text style={styles.rowText}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  list: {
    padding: 16,
    gap: 10,
  },
  row: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowText: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
