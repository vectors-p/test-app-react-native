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
import { createSession, getMuscleGroups } from "../../services/api";
import { getToken } from "../../services/auth";

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
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a muscle group</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              console.log(
                "Navigating with groupId:",
                item.id,
                "sessionId:",
                sessionId,
              );
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
