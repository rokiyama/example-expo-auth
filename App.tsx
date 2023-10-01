import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "./src/useAuth";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { request, authTokens, logout, promptAsync } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />

      {authTokens ? (
        <>
          <Text>{authTokens.idToken}</Text>
          <Button title="Logout" onPress={() => logout()} />
        </>
      ) : (
        <Button
          disabled={!request}
          title="Login"
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
