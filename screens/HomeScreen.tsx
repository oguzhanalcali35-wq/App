import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, LEVELS } from '../lib/types';
import { SENTENCES } from '../lib/data';
import { useStore } from '../lib/store';
import SentenceCard from '../components/SentenceCard';

export default function HomeScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { progress, favorites } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const daily = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return SENTENCES[day % SENTENCES.length];
  }, []);

  const countFor = (lvl: string) => SENTENCES.filter((s) => s.level === lvl).length;
  const studiedPct = Math.round((progress.studiedIds.length / SENTENCES.length) * 100);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaView style={[styles.safe, dark && styles.safeDark]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.wrap}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
            <View style={styles.hero}>
              <View style={styles.heroTop}>
                <View>
                  <Text style={styles.hello}>🇩🇪 BriefMeister</Text>
                  <Text style={styles.heroTitle}>Mektup Almancasında{ '\n'}ustalaş</Text>
                  <Text style={styles.heroSub}>B1 → B2 → C1 · {SENTENCES.length} kalıp cümle · 6 hazır mektup</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Ionicons name="mail" size={30} color="#fff" />
                </View>
              </View>
              <View style={styles.heroStats}>
                <View style={styles.hstat}>
                  <Text style={styles.hstatNum}>{progress.studiedIds.length}</Text>
                  <Text style={styles.hstatLbl}>Öğrenilen</Text>
                </View>
                <View style={styles.hdiv} />
                <View style={styles.hstat}>
                  <Text style={styles.hstatNum}>{favorites.length}</Text>
                  <Text style={styles.hstatLbl}>Favori</Text>
                </View>
                <View style={styles.hdiv} />
                <View style={styles.hstat}>
                  <Text style={styles.hstatNum}>{progress.quizPlays}</Text>
                  <Text style={styles.hstatLbl}>Test</Text>
                </View>
                <View style={styles.hdiv} />
                <View style={styles.hstat}>
                  <Text style={styles.hstatNum}>%{studiedPct}</Text>
                  <Text style={styles.hstatLbl}>İlerleme</Text>
                </View>
              </View>
              <View style={styles.pbar}><View style={[styles.pfill, { width: `${Math.max(studiedPct, 4)}%` }]} /></View>
            </View>

            <Text style={styles.secTitle}>Seviyeni seç</Text>
            {LEVELS.map((l) => (
              <Pressable key={l.id} onPress={() => navigation.navigate('Cümleler', { level: l.id })} style={[styles.lvlCard, dark && styles.cardDark]}>
                <View style={[styles.lvlDot, { backgroundColor: l.color }]}><Text style={styles.lvlDotTxt}>{l.id}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lvlTitle, dark && { color: '#F1F5F9' }]}>{l.title}</Text>
                  <Text style={styles.lvlDesc}>{l.desc} · {countFor(l.id)} cümle</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </Pressable>
            ))}

            <View style={styles.secRow}>
              <Text style={styles.secTitle}>Günün cümlesi</Text>
              <Pressable onPress={() => navigation.navigate('Cümleler', {})}><Text style={styles.link}>Tümü →</Text></Pressable>
            </View>
            <SentenceCard item={daily} />

            <Text style={styles.secTitle}>Kategoriler</Text>
            <View style={styles.grid}>
              {CATEGORIES.map((c) => {
                const cnt = SENTENCES.filter((s) => s.cat === c.id).length;
                return (
                  <Pressable key={c.id} onPress={() => navigation.navigate('Cümleler', { cat: c.id })} style={[styles.gridCard, dark && styles.cardDark]}>
                    <View style={[styles.gridIcon, { backgroundColor: c.color + '1A' }]}>
                      <Ionicons name={c.icon as any} size={22} color={c.color} />
                    </View>
                    <Text style={[styles.gridTitle, dark && { color: '#F1F5F9' }]}>{c.titleTr}</Text>
                    <Text style={styles.gridSub}>{c.titleDe} · {cnt} cümle</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.quizCta} onPress={() => navigation.navigate('Test')}>
              <Ionicons name="trophy" size={28} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>Kendini test et</Text>
                <Text style={styles.quizSub}>10 soruluk seviye testi · DE ⇄ TR</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
            </Pressable>
            <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  safeDark: { backgroundColor: '#0F1522' },
  wrap: { padding: 16 },
  hero: { backgroundColor: '#1E3A5F', borderRadius: 22, padding: 18, marginBottom: 18 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hello: { color: '#FCD34D', fontWeight: '800', fontSize: 13, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 32 },
  heroSub: { color: '#B6C2D2', fontSize: 12.5, marginTop: 6 },
  heroBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#C9A227', alignItems: 'center', justifyContent: 'center' },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 12, marginTop: 14, alignItems: 'center' },
  hstat: { flex: 1, alignItems: 'center' },
  hstatNum: { color: '#fff', fontWeight: '900', fontSize: 18 },
  hstatLbl: { color: '#B6C2D2', fontSize: 11, marginTop: 2 },
  hdiv: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  pbar: { height: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  pfill: { height: 6, backgroundColor: '#FCD34D', borderRadius: 3 },
  secTitle: { fontSize: 18, fontWeight: '900', color: '#1E3A5F', marginBottom: 10, marginTop: 6 },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  link: { color: '#B45309', fontWeight: '700', fontSize: 13 },
  lvlCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F1E8D5' },
  cardDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  lvlDot: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  lvlDotTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
  lvlTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  lvlDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F1E8D5' },
  gridIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  gridTitle: { fontSize: 13.5, fontWeight: '800', color: '#1E293B' },
  gridSub: { fontSize: 11.5, color: '#94A3B8', marginTop: 2 },
  quizCta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#B45309', borderRadius: 18, padding: 18, marginTop: 18 },
  quizTitle: { color: '#fff', fontWeight: '900', fontSize: 17 },
  quizSub: { color: '#FDE68A', fontSize: 12.5, marginTop: 2 },
});
