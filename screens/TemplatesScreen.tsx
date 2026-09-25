import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TEMPLATES } from '../lib/templates';
import { levelColor } from '../lib/types';

export default function TemplatesScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, dark && { color: '#F1F5F9' }]}>Hazır Mektuplar</Text>
        <Text style={styles.sub}>Sınavda çıkabilecek 6 tam mektup · DE + TR</Text>
      </View>
      <FlatList
        data={TEMPLATES}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('MektupDetay', { id: item.id })} style={[styles.card, dark && styles.cardDark]}>
            <View style={styles.cardTop}>
              <View style={[styles.lvl, { backgroundColor: levelColor(item.level) }]}><Text style={styles.lvlTxt}>{item.level}</Text></View>
              <Text style={styles.thema}>{item.thema}</Text>
            </View>
            <Text style={[styles.tTitle, dark && { color: '#F1F5F9' }]}>{item.titleTr}</Text>
            <Text style={styles.tDe}>{item.titleDe}</Text>
            <Text style={styles.preview} numberOfLines={2}>{item.de[1]}</Text>
            <View style={styles.foot}>
              <View style={styles.footItem}><Ionicons name="document-text-outline" size={14} color="#B45309" /><Text style={styles.footTxt}>{item.de.length} paragraf</Text></View>
              <View style={styles.openBtn}><Text style={styles.openTxt}>Oku & Çalış</Text><Ionicons name="arrow-forward" size={14} color="#fff" /></View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E3A5F' },
  sub: { fontSize: 13, color: '#94A3B8', marginTop: 3 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1E8D5', shadowColor: '#1E3A5F', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  cardDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  lvl: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  lvlTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  thema: { fontSize: 12, color: '#B45309', fontWeight: '700' },
  tTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  tDe: { fontSize: 13, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  preview: { fontSize: 13, color: '#94A3B8', marginTop: 8, lineHeight: 19 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  footItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footTxt: { fontSize: 12, color: '#B45309', fontWeight: '600' },
  openBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E3A5F', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  openTxt: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
});
