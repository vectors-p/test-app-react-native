import ScreenAppBar from "@/app/components/ScreenAppBar";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSessions } from "../../../services/api";
import { getToken } from "../../../services/auth";
import DashboardAppBar from "../../components/DashboardAppBar";
import SessionCard from "../../components/SessionCard";

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  function openDrawer() {
    (navigation as any).openDrawer();
  }

  const loadSessions = async () => {
    try {
      setError(null);
      const token = await getToken();

      if (!token) {
        setError("You are not logged in. Please log in again.");
        return;
      }

      const data = await getSessions(token);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Unable to load your workout history. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, []),
  );

  function onRefresh() {
    setRefreshing(true);
    loadSessions();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <DashboardAppBar
          title="History"
          showMenu={true}
          showNotifications={false}
          onMenuPress={openDrawer}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <DashboardAppBar
          title="History"
          showMenu={true}
          showNotifications={false}
          onMenuPress={openDrawer}
        />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadSessions}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScreenAppBar
        title="History"
        onBackPress={() => router.replace("/home")}
      />

      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          sessions.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No workouts logged yet.</Text>
        }
        renderItem={({ item }) => (
          <SessionCard
            date={item.date}
            muscleGroups={item.muscle_groups}
            exercises={item.exercises}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  list: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
