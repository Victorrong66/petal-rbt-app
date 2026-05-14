import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/lib/ThemeContext';
import { light } from './src/lib/ThemeContext';

import WelcomeScreen from './src/screens/WelcomeScreen';
import FeedScreen    from './src/screens/FeedScreen';

const NAME_KEY = 'petal_display_name';

function Root() {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(NAME_KEY).then(name => {
      if (name) setUserName(name);
      setLoading(false);
    });
  }, []);

  async function handleSetName(name) {
    await AsyncStorage.setItem(NAME_KEY, name);
    setUserName(name);
  }

  async function handleClearName() {
    await AsyncStorage.removeItem(NAME_KEY);
    setUserName(null);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: light.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={light.rose} />
      </View>
    );
  }

  if (!userName) return <WelcomeScreen onSetName={handleSetName} />;
  return <FeedScreen userName={userName} onChangeName={handleClearName} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
