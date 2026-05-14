import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView, Alert,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import { useTheme } from '../lib/ThemeContext';

export default function FeedScreen({ userName, onChangeName }) {
  const { colors, isDim, toggleTheme } = useTheme();
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      err  => { console.error(err); setLoading(false); }
    );
    return unsub;
  }, []);

  function handleChangeName() {
    Alert.alert('Change name', 'This will take you back to the start.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Change', onPress: onChangeName },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={isDim ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerLogo, { color: colors.text }]}>🌹 Petal</Text>
        <View style={styles.headerRight}>
          {/* Dim / light toggle */}
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { borderColor: colors.border }]}>
            <Text style={{ fontSize: 16 }}>{isDim ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalOpen(true)} style={[styles.postBtn, { backgroundColor: colors.rose }]}>
            <Text style={styles.postBtnText}>+ Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeName} style={[styles.nameBtn, { borderColor: colors.border }]}>
            <Text style={[styles.nameBtnText, { color: colors.muted }]} numberOfLines={1}>{userName}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={
          <Text style={[styles.stateText, { color: colors.muted }]}>
            {loading ? 'Loading posts...' : 'No posts yet. Be the first! 🌹'}
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <PostModal visible={modalOpen} onClose={() => setModalOpen(false)} userName={userName} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  headerLogo:   { fontSize: 17, fontWeight: '700', letterSpacing: -0.5 },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  postBtn:      { backgroundColor: '#d4785a', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  postBtnText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  nameBtn:      { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, maxWidth: 90 },
  nameBtnText:  { fontSize: 13 },
  list:         { padding: 16, paddingBottom: 40, flexGrow: 1 },
  stateText:    { textAlign: 'center', marginTop: 80, fontSize: 15 },
});
