import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { withIAPContext } from "react-native-iap";
import {
  Billing,
  Camera,
  CheckImages,
  FolderName,
  ForgotPassword,
  History,
  Home,
  MainSplash,
  ManagePassword,
  Preview,
  PricingScreen,
  Profile,
  QADone,
  SelectBackground,
  SelectImageAngles,
  SelectProcessType,
  SelectTemplate,
  SignIn,
  SignUp,
  Splash,
  TaskQueued,
  TermsPolicy,
} from "../screens";
import Main from "../Main";
import DeleteAccount from "../screens/DeleteAccount";
import TaskTray from "../screens/TaskTray";
import ProcessTray from "../screens/ProcessTray";
import QAScreen from "../screens/QAScreen";
import { useAppState } from "../context/AppStateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebViewScreen from "../screens/WebView";
import NetworkLoggerScreen from "../screens/NetworkLoggerScreen";

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const AuthNavigator = ({ isFirstInstall }) => (
  <AuthStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={
      isFirstInstall === "true" ? "SplashScreen" : "MainSplashScreen"
    }
  >
    <AuthStack.Screen name="MainSplashScreen" component={MainSplash} />
    <AuthStack.Screen name="SplashScreen" component={Splash} />
    <AuthStack.Screen name="SignInScreen" component={SignIn} />
    <AuthStack.Screen name="SignUpScreen" component={SignUp} />
    <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
    <AuthStack.Screen name="TermsPolicyScreen" component={TermsPolicy} />
    <AuthStack.Screen
      name="NetworkLoggerScreen"
      component={NetworkLoggerScreen}
    />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator
    initialRouteName="MainScreen"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen
      options={{ headerShown: false }}
      name="HomeScreen"
      component={Home}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="BillingScreen"
      component={Billing}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="ProfileScreen"
      component={Profile}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="MainScreen"
      component={Main}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="ManagePasswordScreen"
      component={ManagePassword}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="DeleteAccountScreen"
      component={DeleteAccount}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="TaskTrayScreen"
      component={TaskTray}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="ProcessTrayScreen"
      component={ProcessTray}
    />
    <MainStack.Screen
      options={{ headerShown: false, orientation: "landscape" }}
      name="QAScreenScreen"
      component={QAScreen}
    />
    <MainStack.Screen
      options={{ headerShown: false, orientation: "landscape" }}
      name="QADoneScreen"
      component={QADone}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="TaskQueuedScreen"
      component={TaskQueued}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="SelectProcessTypeScreen"
      component={SelectProcessType}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="FolderNameScreen"
      component={FolderName}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="SelectBackgroundScreen"
      component={SelectBackground}
    />
    <MainStack.Screen
      options={{ headerShown: false, gestureEnabled: true }}
      name="SelectImageAnglesScreen"
      component={SelectImageAngles}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="SelectTemplateScreen"
      component={SelectTemplate}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="HistoryScreen"
      component={History}
    />
    <MainStack.Screen
      options={{ headerShown: false, gestureEnabled: true }}
      name="CameraScreen"
      component={Camera}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="PreviewScreen"
      component={Preview}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="CheckImagesScreen"
      component={CheckImages}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="WebViewScreen"
      component={WebViewScreen}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="PricingScreen"
      component={withIAPContext(PricingScreen)}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="NetworkLoggerScreen"
      component={NetworkLoggerScreen}
    />
  </MainStack.Navigator>
);

const AppNavigator = () => {
  const { state } = useAppState();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isFirstInstall, setIsFirstInstall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstInstall = async () => {
      const firstInstall = await AsyncStorage.getItem("isFirstInstall");
      setIsFirstInstall(firstInstall);
      setLoading(false);
    };
    checkFirstInstall();
  }, []);

  useEffect(() => {
    setIsSignedIn(!!state.token);
  }, [state.token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const Logger = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          backgroundColor: "lightblue",
          borderRadius: 50,
          left: 0,
          bottom: 250,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigation.navigate("NetworkLoggerScreen")}
      >
        <Text>Logs</Text>
      </TouchableOpacity>
    );
  };

  return (
    <NavigationContainer>
      {/* <Logger /> */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {isSignedIn ? (
        <MainNavigator />
      ) : (
        <AuthNavigator isFirstInstall={isFirstInstall} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
