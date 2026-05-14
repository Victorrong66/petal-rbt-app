import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { useTheme } from '../lib/ThemeContext';

export default function WelcomeScreen({ onSetName }) {
  const { colors, isDim } = useTheme();
  const [name, setName]   = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    const trimmed = name.trim();
    if (!trimmed) { setError('Enter your name first.'); return; }
    onSetName(trimmed);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDim ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🌹</Text>
        <Text style={[styles.title, { color: colors.rose }]}>Petal</Text>
        <Text style={[styles.tagline, { color: colors.muted }]}>
          Share your rose, bud & thorn{'\n'}with the people you care about.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
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

        {error ? <Text style={[styles.error, { color: colors.rose }]}>{error}</Text> : null}

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.rose }]} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.btnText}>Let's go →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji:   { fontSize: 64, marginBottom: 12 },
  title:   { fontSize: 42, fontWeight: '700', letterSpacing: -1, marginBottom: 10 },
  tagline: { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  input: {
    width: '100%', borderWidth: 1.5, borderRadius: 14,
    fontSize: 16, padding: 16, marginBottom: 12,
  },
  error:   { fontSize: 13, marginBottom: 10, alignSelf: 'flex-start' },
  btn:     { width: '100%', borderRadius: 14, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
