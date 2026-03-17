import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, radius } from "../theme";

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 40, marginBottom: 16 }}>⚠️</Text>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Terjadi Kesalahan
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            textAlign: "center",
            marginBottom: 28,
            lineHeight: 20,
          }}
        >
          Aplikasi mengalami error tak terduga. Silakan muat ulang.
        </Text>
        <TouchableOpacity
          onPress={this.handleRetry}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: radius.md,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            Muat Ulang
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
