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
import EmptyState from "../../src/components/EmptyState";
import { colors } from "../../src/theme";

export default function FeedScreen() {
  const { signals, loading, error, fetchInitial, fetchMore } = useSignals();
  const user = useAuthStore((s) => s.user);
  const canViewDetail = user?.plan === "premium" || user?.plan === "affiliate";

  useEffect(() => {
    fetchInitial();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <EmptyState message={error} onRetry={fetchInitial} />
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
          tintColor={colors.green}
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
          <EmptyState message="Belum ada sinyal" onRetry={fetchInitial} />
        ) : null
      }
      ListFooterComponent={
        loading && signals.length > 0 ? (
          <ActivityIndicator style={{ margin: 16 }} color={colors.green} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 8, backgroundColor: colors.background, flexGrow: 1 },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: colors.textPrimary },
  freeNote: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  errorContainer: { flex: 1, backgroundColor: colors.background },
});
