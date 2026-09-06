import React from "react";
import { StyleSheet, View } from "react-native";
import DashboardAppBar from "./components/DashboardAppBar";
import TodaysVolumeCard from "./components/TodaysVolumeCard";

export default function Home() {
  return (
    <View style={styles.container}>
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
      <TodaysVolumeCard workouts={10} sets={20} weight={100} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
