import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/ThemeContext';

const SEGMENTS = [
  { key: 'rose',  icon: '🌹', label: 'Rose'  },
  { key: 'bud',   icon: '🌱', label: 'Bud'   },
  { key: 'thorn', icon: '🥀', label: 'Thorn' },
];

function formatDate(ts) {
  if (!ts) return 'Just now';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PostCard({ post }) {
  const { colors } = useTheme();
  const segColors  = { rose: colors.rose, bud: colors.bud, thorn: colors.thorn };
  const initial    = (post.name || '?')[0].toUpperCase();
  const filled     = SEGMENTS.filter(s => post[s.key]);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.meta}>
        <View style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.avatarText, { color: colors.rose }]}>{initial}</Text>
        </View>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>{post.name || 'Anonymous'}</Text>
          <Text style={[styles.date, { color: colors.muted }]}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      {filled.map((seg, i) => (
        <View key={seg.key} style={[styles.segment, i === 0 && styles.segmentFirst, { borderTopColor: colors.border }]}>
          <Text style={styles.segIcon}>{seg.icon}</Text>
          <View style={styles.segBody}>
            <Text style={[styles.segLabel, { color: segColors[seg.key] }]}>{seg.label.toUpperCase()}</Text>
            <Text style={[styles.segText, { color: colors.text }]}>{post[seg.key]}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5, borderRadius: 18, padding: 18, marginBottom: 14,
    shadowColor: '#a08060', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 2,
  },
  meta:          { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar:        { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { fontWeight: '700', fontSize: 16 },
  name:          { fontWeight: '600', fontSize: 14 },
  date:          { fontSize: 12, marginTop: 1 },
  segment:       { flexDirection: 'row', gap: 10, paddingTop: 12, borderTopWidth: 1 },
  segmentFirst:  { borderTopWidth: 0, paddingTop: 0 },
  segIcon:       { fontSize: 18, marginTop: 1 },
  segBody:       { flex: 1 },
  segLabel:      { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 3 },
  segText:       { fontSize: 14, lineHeight: 21 },
});
