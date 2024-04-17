import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Billing,
  Camera,
  FolderName,
  ForgotPassword,
  History,
  Home,
  ManagePassword,
  Preview,
  Profile,
  QADone,
  SelectBackground,
  SelectImageAngles,
  SelectProcessType,
  SelectTemplate,
  SignIn,
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

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SplashScreen" component={Splash} />
    <AuthStack.Screen name="SignInScreen" component={SignIn} />
    <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
    <AuthStack.Screen name="TermsPolicyScreen" component={TermsPolicy} />
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
      options={{ headerShown: false }}
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
      options={{ headerShown: false }}
      name="CameraScreen"
      component={Camera}
    />
    <MainStack.Screen
      options={{ headerShown: false }}
      name="PreviewScreen"
      component={Preview}
    />
  </MainStack.Navigator>
);

const AppNavigator = () => {
  const { state } = useAppState();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(!!state.token);
  }, [state.token]);
  return (
    <NavigationContainer>
      {isSignedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
