import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const SEGMENTS = [
  { key: 'rose',  icon: '🌹', label: 'Rose',  color: colors.rose  },
  { key: 'bud',   icon: '🌱', label: 'Bud',   color: colors.bud   },
  { key: 'thorn', icon: '🥀', label: 'Thorn', color: colors.thorn },
];

function formatDate(ts) {
  if (!ts) return 'Just now';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostCard({ post }) {
  const initial = (post.name || '?')[0].toUpperCase();
  const filled  = SEGMENTS.filter(s => post[s.key]);

  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View>
          <Text style={styles.name}>{post.name || 'Anonymous'}</Text>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      {filled.map((seg, i) => (
        <View key={seg.key} style={[styles.segment, i === 0 && styles.segmentFirst]}>
          <Text style={styles.segIcon}>{seg.icon}</Text>
          <View style={styles.segBody}>
            <Text style={[styles.segLabel, { color: seg.color }]}>{seg.label.toUpperCase()}</Text>
            <Text style={styles.segText}>{post[seg.key]}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  name: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    color: colors.muted,
    fontSize: 12,
  },
  segment: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  segmentFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  segIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  segBody: {
    flex: 1,
  },
  segLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  segText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
