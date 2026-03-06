import { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSignals } from "../../src/hooks/useSignals";
import { useAuthStore } from "../../src/store/authStore";
import SignalCard from "../../src/components/SignalCard";

export default function FeedScreen() {
  const { signals, loading, error, fetchInitial, fetchMore } = useSignals();
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";

  useEffect(() => {
    fetchInitial();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={signals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SignalCard signal={item} canViewDetail={canViewDetail} />
      )}
      contentContainerStyle={styles.list}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl
          refreshing={loading && signals.length === 0}
          onRefresh={fetchInitial}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Sinyal Terbaru</Text>
          {user?.plan === "free" && (
            <Text style={styles.freeNote}>Free plan: 10 sinyal terbaru</Text>
          )}
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <View style={styles.center}>
            <Text style={styles.empty}>Belum ada sinyal</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        loading && signals.length > 0 ? (
          <ActivityIndicator style={{ margin: 16 }} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 8, backgroundColor: "#f5f5f5", flexGrow: 1 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  freeNote: { fontSize: 12, color: "#888", marginTop: 4 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  error: { color: "#FF3B30", textAlign: "center" },
  empty: { color: "#888", fontSize: 16 },
});
