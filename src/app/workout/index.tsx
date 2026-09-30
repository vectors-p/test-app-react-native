import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createSession, getMuscleGroups } from "../../services/api";
import { getToken } from "../../services/auth";
import ScreenAppBar from "../components/ScreenAppBar";

export default function MuscleGroupPicker() {
  const { sessionId: existingSessionId } = useLocalSearchParams<{
    sessionId?: string;
  }>();
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(
    existingSessionId ? Number(existingSessionId) : null,
  );

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;

      const groupsData = await getMuscleGroups(token);
      setGroups(groupsData);

      if (!existingSessionId) {
        const session = await createSession(token);
        setSessionId(session.id);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScreenAppBar title="Choose a muscle group" />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScreenAppBar
        title="Choose a muscle group"
        rightIcon="list-outline"
        onRightPress={() =>
          router.push({
            pathname: "/workout/session-summary",
            params: { sessionId },
          })
        }
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: "/workout/[groupId]",
                params: { groupId: item.id, sessionId },
              });
            }}
          >
            <Text style={styles.cardText}>{item.name}</Text>
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
    gap: 12,
  },
  card: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
