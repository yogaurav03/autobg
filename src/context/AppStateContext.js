import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useReducer, useContext, useEffect } from "react";

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

const initialState = {
  // Define your initial state here
  data: [],
  mainContent: "HomeScreen",
  token: "",
  profileData: {},
  taskTrayData: [],
  carAnglesData: [],
};

const appStateReducer = (state, action) => {
  switch (action.type) {
    case "ADD_DATA":
      return { ...state, data: [...state.data, action.payload] };
    case "MAIN_CONTENT":
      return { ...state, mainContent: action.payload };
    case "PROFILE_DATA":
      return { ...state, profileData: action.payload };
    case "TASK_TRAY_DATA":
      return { ...state, taskTrayData: action.payload };
    case "CAR_ANGLES_DATA":
      return { ...state, carAnglesData: action.payload };
    case "TOKEN":
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const updateRemainingTime = () => {
    const currentTime = Date.now();
    const updatedTaskTrayData = state.taskTrayData.map((item) => ({
      ...item,
      remainingTime: Math.max(
        0,
        item.duration - (currentTime - item.startTime) / 1000
      ),
    }));
    dispatch({ type: "UPDATE_TASK_TRAY_DATA", payload: updatedTaskTrayData });
  };

  // Start an interval when the AppStateProvider mounts
  useEffect(() => {
    const timerId = setInterval(() => {
      updateRemainingTime();
    }, 1000); // Update every second

    return () => clearInterval(timerId);
  }, [state.taskTrayData]);

  // Load the token from AsyncStorage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          dispatch({ type: "TOKEN", payload: savedToken });
        }
      } catch (error) {
        console.error("Failed to load the token:", error);
      }
    };

    loadToken();
  }, []);

  // Save the token to AsyncStorage whenever it changes
  useEffect(() => {
    const saveToken = async () => {
      try {
        await AsyncStorage.setItem("token", state.token);
      } catch (error) {
        console.error("Failed to save the token:", error);
      }
    };

    if (state.token) {
      saveToken();
    }
  }, [state.token]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
