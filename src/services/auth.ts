import * as SecureStore from "expo-secure-store";
import { logout as apiLogout } from "./api";

const TOKEN_KEY = "auth_token";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function performLogout() {
  try {
    const token = await getToken();
    if (token) {
      await apiLogout(token); // invalidate server-side
    }
  } catch (err) {
    console.log("Server logout failed (continuing with local logout):", err);
  } finally {
    await clearToken(); // always clear locally, even if server call failed
  }
}
