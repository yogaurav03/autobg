import React from 'react';
import {Home, Profile} from './screens';
import {useAppState} from './context/AppStateContext';
import BottomTab from './components/BottomTab';

const Main = () => {
  const {state} = useAppState();
  return (
    <>
      {state?.mainContent === 'HomeScreen' ? <Home /> : <Profile />}
      <BottomTab />
    </>
  );
};

export default Main;
