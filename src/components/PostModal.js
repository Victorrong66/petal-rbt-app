import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { colors } from '../theme';

const FIELDS = [
  { key: 'rose',  icon: '🌹', label: 'Rose',  color: colors.rose,  hint: 'Something good that happened' },
  { key: 'bud',   icon: '🌱', label: 'Bud',   color: colors.bud,   hint: 'Something you\'re looking forward to' },
  { key: 'thorn', icon: '🥀', label: 'Thorn', color: colors.thorn, hint: 'Something that was tough' },
];

export default function PostModal({ visible, onClose, userName }) {
  const [values, setValues] = useState({ rose: '', bud: '', thorn: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  function setValue(key, val) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  function reset() {
    setValues({ rose: '', bud: '', thorn: '' });
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    const rose  = values.rose.trim();
    const bud   = values.bud.trim();
    const thorn = values.thorn.trim();

    if (!rose && !bud && !thorn) {
      setError('Fill in at least one field.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'posts'), {
        name:      userName,
        rose:      rose  || null,
        bud:       bud   || null,
        thorn:     thorn || null,
        createdAt: serverTimestamp(),
      });
      reset();
      onClose();
    } catch (e) {
      setError('Failed to post. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kvContainer}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Today's Check-in</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {FIELDS.map(f => (
              <View key={f.key} style={styles.field}>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldIcon}>{f.icon}</Text>
                  <Text style={[styles.fieldName, { color: f.color }]}>{f.label}</Text>
                  <Text style={styles.fieldHint}>{f.hint}</Text>
                </View>
                <TextInput
                  style={[styles.input, { borderColor: values[f.key] ? f.color : colors.border }]}
                  placeholder={`What was your ${f.label.toLowerCase()}?`}
                  placeholderTextColor={colors.muted}
                  value={values[f.key]}
                  onChangeText={v => setValue(f.key, v)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            ))}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.submitText}>Share with your crew</Text>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  kvContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: colors.muted,
    fontSize: 16,
  },
  field: {
    marginBottom: 18,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  fieldIcon: {
    fontSize: 16,
  },
  fieldName: {
    fontWeight: '700',
    fontSize: 14,
  },
  fieldHint: {
    color: colors.muted,
    fontSize: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    lineHeight: 20,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: colors.rose,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
