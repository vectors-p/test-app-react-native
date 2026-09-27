import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "../components/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="history/index" options={{ title: "History" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
