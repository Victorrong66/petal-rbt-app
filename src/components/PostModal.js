import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Pressable,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../lib/ThemeContext';

const FIELDS = [
  { key: 'rose',  icon: '🌹', label: 'Rose',  hint: 'Something good that happened' },
  { key: 'bud',   icon: '🌱', label: 'Bud',   hint: "Something you're looking forward to" },
  { key: 'thorn', icon: '🥀', label: 'Thorn', hint: 'Something that was tough' },
];

export default function PostModal({ visible, onClose, userName }) {
  const { colors } = useTheme();
  const segColors  = { rose: colors.rose, bud: colors.bud, thorn: colors.thorn };
  const [values, setValues]   = useState({ rose: '', bud: '', thorn: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function setValue(key, val) { setValues(prev => ({ ...prev, [key]: val })); }
  function reset() { setValues({ rose: '', bud: '', thorn: '' }); setError(''); }
  function handleClose() { reset(); onClose(); }

  async function handleSubmit() {
    const rose = values.rose.trim(), bud = values.bud.trim(), thorn = values.thorn.trim();
    if (!rose && !bud && !thorn) { setError('Fill in at least one field.'); return; }
    setLoading(true); setError('');
    try {
      await addDoc(collection(db, 'posts'), {
        name: userName, rose: rose || null, bud: bud || null,
        thorn: thorn || null, createdAt: serverTimestamp(),
      });
      reset(); onClose();
    } catch (e) {
      setError('Failed to post. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kvContainer}>
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Today's Check-in</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {FIELDS.map(f => (
              <View key={f.key} style={styles.field}>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldIcon}>{f.icon}</Text>
                  <Text style={[styles.fieldName, { color: segColors[f.key] }]}>{f.label}</Text>
                  <Text style={[styles.fieldHint, { color: colors.muted }]}>{f.hint}</Text>
                </View>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: colors.surface,
                    borderColor: values[f.key] ? segColors[f.key] : colors.border,
                    color: colors.text,
                  }]}
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

            {error ? <Text style={[styles.error, { color: colors.rose }]}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.rose }, loading && styles.disabled]}
              onPress={handleSubmit} disabled={loading}
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
  backdrop:    { flex: 1, backgroundColor: 'rgba(30, 20, 10, 0.4)' },
  kvContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet:       { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1.5, padding: 20, paddingBottom: 44, maxHeight: '92%' },
  handle:      { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title:       { fontSize: 18, fontWeight: '700' },
  closeBtn:    { padding: 6 },
  closeText:   { fontSize: 16 },
  field:       { marginBottom: 18 },
  fieldLabel:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  fieldIcon:   { fontSize: 16 },
  fieldName:   { fontWeight: '700', fontSize: 14 },
  fieldHint:   { fontSize: 12 },
  input:       { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 80, lineHeight: 20 },
  error:       { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  submitBtn:   { borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 8 },
  disabled:    { opacity: 0.6 },
  submitText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
});
