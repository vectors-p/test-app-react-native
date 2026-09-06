import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DashboardAppBarProps = {
  title: string;
  showMenu?: boolean;
  showNotifications?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
};

export default function DashboardAppBar({
  title,
  showMenu = false,
  showNotifications = false,
  onMenuPress,
  onNotificationPress,
}: DashboardAppBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showMenu && (
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
            onPress={onMenuPress}
          >
            <Ionicons name="menu-outline" size={25} color="#1F2937" />
          </Pressable>
        )}

        <View>
          <Text style={styles.subtitle}>Welcome back</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {showNotifications && (
        <Pressable
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && styles.pressed,
          ]}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications-outline" size={23} color="#1F2937" />

          {/* <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View> */}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 82,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    position: "relative",
  },

  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.6,
  },
});
