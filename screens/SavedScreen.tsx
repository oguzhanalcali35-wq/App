import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LEVELS } from '../lib/types';
import { SENTENCES } from '../lib/data';
import { useStore } from '../lib/store';
import SentenceCard from '../components/SentenceCard';

export default function SavedScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { favorites, progress } = useStore();
  const favSentences = useMemo(() => SENTENCES.filter((s) => favorites.includes(s.id)), [favorites]);

  const exportFavs = async () => {
    const txt = favSentences.map((s, i) => `${i + 1}. [${s.level}] ${s.de}\n   ${s.tr}`).join('\n\n');
    try { await Share.share({ message: `🇩🇪 BriefMeister Favorilerim\n\n${txt}` }); }
    catch { await Clipboard.setStringAsync(txt); }
  };

  const pct = Math.round((progress.studiedIds.length / SENTENCES.length) * 100);

  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
      <FlatList
        data={favSentences}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, dark && { color: '#F1F5F9' }]}>Defterim</Text>
            <Text style={styles.sub}>Favoriler, ilerleme ve çalışma özeti</Text>
            <View style={[styles.progCard, dark && styles.cardDark]}>
              <View style={styles.progTop}>
                <Text style={[styles.progTitle, dark && { color: '#F1F5F9' }]}>Genel ilerleme</Text>
                <Text style={styles.progPct}>%{pct}</Text>
              </View>
              <View style={styles.pbar}><View style={[styles.pfill, { width: `${Math.max(pct, 3)}%` }]} /></View>
              <Text style={styles.progSub}>{progress.studiedIds.length}/{SENTENCES.length} cümle öğrenildi · {progress.quizPlays} test çözüldü</Text>
              <View style={styles.lvlRow}>
                {LEVELS.map((l) => {
                  const total = SENTENCES.filter((s) => s.level === l.id).length;
                  const done = SENTENCES.filter((s) => s.level === l.id && progress.studiedIds.includes(s.id)).length;
                  return (
                    <View key={l.id} style={styles.lvlBox}>
                      <Text style={[styles.lvlName, { color: l.color }]}>{l.id}</Text>
                      <Text style={[styles.lvlNum, dark && { color: '#F1F5F9' }]}>{done}/{total}</Text>
                      <View style={styles.miniBar}><View style={[styles.miniFill, { width: `${total ? (done / total) * 100 : 0}%`, backgroundColor: l.color }]} /></View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.favHead}>
              <Text style={[styles.secTitle, dark && { color: '#F1F5F9' }]}>Favorilerim ({favSentences.length})</Text>
              {favSentences.length > 0 && (
                <Pressable onPress={exportFavs} style={styles.shareBtn}>
                  <Ionicons name="share-outline" size={15} color="#fff" />
                  <Text style={styles.shareTxt}>Paylaş</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => <SentenceCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="bookmark-outline" size={34} color="#B45309" /></View>
            <Text style={[styles.emptyT, dark && { color: '#F1F5F9' }]}>Henüz favori yok</Text>
            <Text style={styles.emptyS}>Beğendiğin cümlelerdeki 🔖 simgesine dokun, burada biriksinler.</Text>
            <Pressable onPress={() => navigation.navigate('Cümleler', {})} style={styles.goBtn}>
              <Text style={styles.goTxt}>Cümlelere göz at</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  cardDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E3A5F' },
  sub: { fontSize: 13, color: '#94A3B8', marginTop: 3 },
  progCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginTop: 12, marginBottom: 6, borderWidth: 1, borderColor: '#F1E8D5' },
  progTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  progPct: { fontSize: 18, fontWeight: '900', color: '#B45309' },
  pbar: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  pfill: { height: 8, backgroundColor: '#B45309', borderRadius: 4 },
  progSub: { fontSize: 12, color: '#94A3B8', marginTop: 8 },
  lvlRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  lvlBox: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, alignItems: 'center' },
  lvlName: { fontSize: 13, fontWeight: '900' },
  lvlNum: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 2 },
  miniBar: { height: 4, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  miniFill: { height: 4, borderRadius: 2 },
  favHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 10 },
  secTitle: { fontSize: 17, fontWeight: '800', color: '#1E3A5F' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1E3A5F', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20 },
  shareTxt: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 30 },
  emptyIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  emptyT: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginTop: 12 },
  emptyS: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 6, lineHeight: 19, paddingHorizontal: 20 },
  goBtn: { backgroundColor: '#B45309', borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12, marginTop: 14 },
  goTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
