import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getExercisesForGroup } from "../../services/api";
import { getToken } from "../../services/auth";

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
      console.log("TOKEN:", token);
      console.log("GROUP ID PARAM:", groupId, typeof groupId);

      if (!token) {
        console.log("No token found, aborting");
        return;
      }

      try {
        const data = await getExercisesForGroup(token, Number(groupId));
        console.log("EXERCISES RESPONSE:", JSON.stringify(data));
        setExercises(data);
      } catch (err) {
        console.log("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose an exercise</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10 }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
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
