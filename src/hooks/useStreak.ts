import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_STREAK = "streak_count";
const KEY_LAST_OPEN = "streak_last_open";

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    updateStreak();
  }, []);

  async function updateStreak() {
    try {
      const today = new Date().toDateString();
      const lastOpen = await AsyncStorage.getItem(KEY_LAST_OPEN);
      const stored = await AsyncStorage.getItem(KEY_STREAK);
      const current = parseInt(stored ?? "0", 10);

      const yesterday = new Date(Date.now() - 86_400_000).toDateString();

      let next = current;
      if (lastOpen === today) {
        // Already opened today, just read current streak
        next = current;
      } else if (lastOpen === yesterday) {
        // Opened yesterday → increment streak
        next = current + 1;
        await AsyncStorage.setItem(KEY_STREAK, String(next));
      } else {
        // Streak broken → reset to 1
        next = 1;
        await AsyncStorage.setItem(KEY_STREAK, "1");
      }

      await AsyncStorage.setItem(KEY_LAST_OPEN, today);
      setStreak(next);
    } catch {
      // AsyncStorage not critical, fail silently
    }
  }

  return streak;
}
