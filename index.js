import { AppRegistry, LogBox } from "react-native";
import { startNetworkLogging } from "react-native-network-logger";
import App from "./App";
import { name as appName } from "./app.json";

startNetworkLogging();
LogBox.ignoreAllLogs(["Warning: ..."]);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

AppRegistry.registerComponent(appName, () => App);
