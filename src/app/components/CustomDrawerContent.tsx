import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "expo-router/drawer";
import { router } from "expo-router";
import { performLogout } from "../../services/auth";

export default function CustomDrawerContent(props: any) {
  async function handleLogout() {
    await performLogout();
    router.replace("/");
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gym Tracker</Text>
      </View>

      <DrawerItem label="Dashboard" onPress={() => router.push("/home")} />
      <DrawerItem label="History" onPress={() => router.push("/history")} />

      <View style={styles.divider} />

      <Pressable style={styles.logoutTile} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#111827" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  logoutTile: {
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
  },
  logoutText: { color: "#DC2626", fontWeight: "700", fontSize: 15 },
});