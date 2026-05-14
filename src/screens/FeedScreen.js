import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import { colors } from '../theme';

export default function FeedScreen({ userName, onChangeName }) {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snap => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  function handleChangeName() {
    Alert.alert('Change name', 'This will take you back to the start.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Change', onPress: onChangeName },
    ]);
  }

  function renderEmpty() {
    if (loading) return <Text style={styles.stateText}>Loading posts...</Text>;
    return <Text style={styles.stateText}>No posts yet. Be the first! 🌹</Text>;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerLogo}>🌹 Petal</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.postBtn}>
            <Text style={styles.postBtnText}>+ Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeName} style={styles.nameBtn}>
            <Text style={styles.nameBtnText} numberOfLines={1}>{userName}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <PostModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        userName={userName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLogo: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postBtn: {
    backgroundColor: colors.rose,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  nameBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: 90,
  },
  nameBtnText: {
    color: colors.muted,
    fontSize: 13,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  stateText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 80,
    fontSize: 15,
  },
});
