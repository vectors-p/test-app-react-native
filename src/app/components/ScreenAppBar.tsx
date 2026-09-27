import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScreenAppBarProps = {
  title: string;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function ScreenAppBar({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
}: ScreenAppBarProps) {
  function handleBack() {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        onPress={handleBack}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={24} color="#1F2937" />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon ? (
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
          onPress={onRightPress}
          hitSlop={8}
        >
          <Ionicons name={rightIcon} size={22} color="#1F2937" />
        </Pressable>
      ) : (
        <View style={styles.iconButton} /> // keeps title centered even with no right icon
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  pressed: {
    opacity: 0.6,
  },
});
