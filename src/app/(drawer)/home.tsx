import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDashboard } from "../../services/api";
import { getToken } from "../../services/auth";
import DashboardAppBar from "../components/DashboardAppBar";
import LastWorkoutCard from "../components/LastWorkoutCard";
import RecentProgressCard from "../components/RecentProgressCard";
import StaleMilestonesCard from "../components/StaleMileStonesCard";
import TodaysVolumeCard from "../components/TodaysVolumeCard";

type DashboardData = {
  todays_volume: { workouts: number; sets: number; weight: number };
  last_workout: { date: string; workout: string } | null;
  stale_milestones: { name: string; sessions_since_improvement: number }[];
  recent_progress: { name: string; progress: string }[];
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const loadDashboard = useCallback(async () => {
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/");
        return;
      }
      const dashboard = await getDashboard(token);
      setData(dashboard);
    } catch (err: any) {
      console.log("Dashboard load failed", err);
      setError(
        "Couldn't load your dashboard. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <DashboardAppBar title="Dashboard" showMenu showNotifications />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadDashboard}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function openDrawer() {
    (navigation as any).openDrawer();
  }

  function onRefresh() {
    setRefreshing(true);
    loadDashboard();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <DashboardAppBar title="Dashboard" showMenu showNotifications />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <DashboardAppBar
        title="Dashboard"
        showMenu={true}
        showNotifications={true}
        onMenuPress={openDrawer}
        onNotificationPress={() => console.log("Open notifications")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TodaysVolumeCard
          workouts={data?.todays_volume.workouts ?? 0}
          sets={data?.todays_volume.sets ?? 0}
          weight={data?.todays_volume.weight ?? 0}
        />

        <LastWorkoutCard
          workout={data?.last_workout?.workout ?? "No workouts yet"}
        />

        <StaleMilestonesCard
          exercises={
            data?.stale_milestones.map((s) => ({
              name: s.name,
              sessionsSinceImprovement: s.sessions_since_improvement,
            })) ?? []
          }
        />

        <RecentProgressCard exercises={data?.recent_progress ?? []} />

        <Pressable
          style={styles.startButton}
          onPress={() => router.push("/workout" as any)}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </Pressable>
        <Pressable
          style={[
            styles.startButton,
            {
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#D1D5DB",
            },
          ]}
          onPress={() => router.push("/history" as any)}
        >
          <Text style={[styles.startButtonText, { color: "#374151" }]}>
            View History
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { paddingBottom: 24 },
  startButton: {
    marginTop: 20,
    marginHorizontal: 16,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 12,
    marginHorizontal: 16,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
