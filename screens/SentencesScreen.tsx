import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, LEVELS, Level } from '../lib/types';
import { SENTENCES } from '../lib/data';
import SentenceCard from '../components/SentenceCard';

export default function SentencesScreen({ route }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const initLevel: Level | 'Tümü' = route?.params?.level ?? 'Tümü';
  const initCat: string | 'Tümü' = route?.params?.cat ?? 'Tümü';
  const [level, setLevel] = useState<Level | 'Tümü'>(initLevel);
  const [cat, setCat] = useState<string>(initCat);
  const [formal, setFormal] = useState<string>('Tümü');
  const [q, setQ] = useState('');

  React.useEffect(() => {
    if (route?.params?.level) setLevel(route.params.level);
    if (route?.params?.cat) setCat(route.params.cat);
  }, [route?.params]);

  const filtered = useMemo(() => {
    return SENTENCES.filter((s) => {
      if (level !== 'Tümü' && s.level !== level) return false;
      if (cat !== 'Tümü' && s.cat !== cat) return false;
      if (formal !== 'Tümü' && s.formal !== formal) return false;
      if (q.trim()) {
        const needle = q.toLocaleLowerCase('tr');
        if (!(s.de.toLowerCase().includes(needle) || s.tr.toLocaleLowerCase('tr').includes(needle))) return false;
      }
      return true;
    });
  }, [level, cat, formal, q]);

  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, dark && { color: '#F1F5F9' }]}>Kalıp Cümleler</Text>
        <Text style={styles.count}>{filtered.length} cümle</Text>
      </View>
      <View style={[styles.searchBox, dark && styles.searchDark]}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput value={q} onChangeText={setQ} placeholder="Ara: z.B. Bewerbung, Rechnung, Einladung..." placeholderTextColor="#94A3B8" style={[styles.input, dark && { color: '#fff' }]} returnKeyType="search" />
        {q ? <Pressable onPress={() => setQ('')}><Ionicons name="close-circle" size={18} color="#94A3B8" /></Pressable> : null}
      </View>
      <View style={styles.rowWrap}>
        {['Tümü', ...LEVELS.map((l) => l.id)].map((l) => (
          <Pressable key={l} onPress={() => setLevel(l as any)} style={[styles.chip, level === l && styles.chipActive]}>
            <Text style={[styles.chipTxt, level === l && styles.chipTxtActive]}>{l}</Text>
          </Pressable>
        ))}
        <View style={styles.sep} />
        {['Tümü', 'resmi', 'gayriresmi', 'nötr'].map((f) => (
          <Pressable key={f} onPress={() => setFormal(f)} style={[styles.chip, formal === f && styles.chipGold]}>
            <Text style={[styles.chipTxt, formal === f && styles.chipTxtActive]}>{f === 'Tümü' ? 'Hepsi' : f === 'resmi' ? 'Resmi' : f === 'gayriresmi' ? 'Samimi' : 'Nötr'}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={[{ id: 'cats' }, ...filtered.map((s) => ({ id: s.id, s }))]} 
        keyExtractor={(i: any) => i.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        renderItem={({ item }: any) => {
          if (item.id === 'cats')
            return (
              <FlatList horizontal showsHorizontalScrollIndicator={false} data={[{ id: 'Tümü' }, ...CATEGORIES]} keyExtractor={(c) => c.id} style={{ marginBottom: 12, marginTop: 4 }} renderItem={({ item: c }: any) => c.id === 'Tümü' ? (
                <Pressable onPress={() => setCat('Tümü')} style={[styles.catChip, cat === 'Tümü' && { backgroundColor: '#1E3A5F' }]}><Text style={[styles.catChipTxt, cat === 'Tümü' && { color: '#fff' }]}>Tümü</Text></Pressable>
              ) : (
                <Pressable onPress={() => setCat(cat === c.id ? 'Tümü' : c.id)} style={[styles.catChip, cat === c.id && { backgroundColor: c.color, borderColor: c.color }]}>
                  <Ionicons name={c.icon as any} size={14} color={cat === c.id ? '#fff' : c.color} />
                  <Text style={[styles.catChipTxt, cat === c.id && { color: '#fff' }, { color: cat === c.id ? '#fff' : c.color }]}>{c.titleTr}</Text>
                </Pressable>
              )} />
            );
          return <SentenceCard item={item.s} />;
        }}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={44} color="#CBD5E1" /><Text style={styles.emptyT}>Sonuç bulunamadı</Text><Text style={styles.emptyS}>Farklı bir kelime veya filtre deneyin.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 16, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E3A5F' },
  count: { fontSize: 12.5, color: '#B45309', fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 14, margin: 16, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#F1E8D5' },
  searchDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  input: { flex: 1, fontSize: 14, color: '#1E293B' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 4 },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  chipGold: { backgroundColor: '#B45309', borderColor: '#B45309' },
  chipTxt: { fontSize: 12.5, fontWeight: '700', color: '#64748B' },
  chipTxtActive: { color: '#fff' },
  sep: { width: 1, backgroundColor: '#E2E8F0' },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  catChipTxt: { fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyT: { fontSize: 17, fontWeight: '800', color: '#64748B', marginTop: 12 },
  emptyS: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
});
