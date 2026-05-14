import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';

const NAME_KEY = 'petal_display_name';

export default function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleContinue() {
    const trimmed = name.trim();
    if (!trimmed) { setError('Enter your name first.'); return; }
    await AsyncStorage.setItem(NAME_KEY, trimmed);
    navigation.replace('Feed', { userName: trimmed });
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.emoji}>🌹</Text>
        <Text style={styles.title}>Petal</Text>
        <Text style={styles.tagline}>
          Share your rose, bud & thorn{'\n'}with the people you care about.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="What should we call you?"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={v => { setName(v); setError(''); }}
          onSubmitEditing={handleContinue}
          returnKeyType="done"
          maxLength={40}
          autoCorrect={false}
          autoCapitalize="words"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.btnText}>Let's go →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.rose,
    letterSpacing: -1,
    marginBottom: 10,
  },
  tagline: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.text,
    fontSize: 16,
    padding: 16,
    marginBottom: 12,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 13,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  btn: {
    width: '100%',
    backgroundColor: colors.rose,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
