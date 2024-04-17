import React from "react";
import { AppNavigator } from "./src/navigation";
import { AppStateProvider } from "./src/context/AppStateContext";

const App = () => {
  return (
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  );
};

export default App;
