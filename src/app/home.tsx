import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDashboard } from "../services/api";
import { getToken } from "../services/auth";
import DashboardAppBar from "./components/DashboardAppBar";
import LastWorkoutCard from "./components/LastWorkoutCard";
import RecentProgressCard from "./components/RecentProgressCard";
import StaleMilestonesCard from "./components/StaleMileStonesCard";
import TodaysVolumeCard from "./components/TodaysVolumeCard";

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

  const loadDashboard = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/");
        return;
      }
      const dashboard = await getDashboard(token);
      setData(dashboard);
    } catch (err) {
      console.log("Dashboard load failed", err);
      router.replace("/");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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
        onMenuPress={() => console.log("Open drawer")}
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
              weeks: s.sessions_since_improvement,
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
});
