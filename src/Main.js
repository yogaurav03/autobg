import React, { useEffect } from "react";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { enableScreens } from "react-native-screens";
import { Home, Profile } from "./screens";
import { useAppState } from "./context/AppStateContext";
import BottomTab from "./components/BottomTab";

enableScreens();

const Main = () => {
  const { state } = useAppState();
  useEffect(() => {
    const initPurchases = async () => {
      try {
        await Purchases.configure({
          apiKey: "appl_XaAnusAplOupuKfAxqhIdBSgxWb",
        });
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    initPurchases();
  }, []);
  return (
    <>
      {state?.mainContent === "HomeScreen" ? <Home /> : <Profile />}
      <BottomTab />
    </>
  );
};

export default Main;
