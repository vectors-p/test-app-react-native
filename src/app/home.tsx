import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardAppBar from "./components/DashboardAppBar";
import LastWorkoutCard from "./components/LastWorkoutCard";
import RecentProgressCard from "./components/RecentProgressCard";
import StaleMilestonesCard from "./components/StaleMileStonesCard";
import TodaysVolumeCard from "./components/TodaysVolumeCard";

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <DashboardAppBar
        title="Dashboard"
        showMenu={true}
        showNotifications={true}
        onMenuPress={() => {
          console.log("Open drawer");
        }}
        onNotificationPress={() => {
          console.log("Open notifications");
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TodaysVolumeCard workouts={10} sets={20} weight={100} />

        <LastWorkoutCard workout="Back & Biceps" />

        <StaleMilestonesCard
          exercises={[
            { name: "Bench Press", weeks: 3 },
            { name: "Squat", weeks: 4 },
            { name: "Shoulder Press", weeks: 5 },
            { name: "Barbell Row", weeks: 6 },
          ]}
        />

        <RecentProgressCard
          exercises={[
            { name: "Bench Press", progress: "+5 kg" },
            { name: "Squat", progress: "+10 kg" },
            { name: "Lat Pulldown", progress: "+5 kg" },
            { name: "Bicep Curl", progress: "+2 kg" },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    paddingBottom: 24,
  },
});
