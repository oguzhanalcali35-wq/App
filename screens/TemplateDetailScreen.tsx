import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { TEMPLATES } from '../lib/templates';
import { levelColor } from '../lib/types';

type Mode = 'both' | 'de' | 'tr';

export default function TemplateDetailScreen({ route, navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const t = TEMPLATES.find((x) => x.id === route.params.id) ?? TEMPLATES[0];
  const [mode, setMode] = useState<Mode>('both');
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullDe = t.de.join('\n\n');
  const speakAll = () => {
    try {
      if (speaking) { Speech.stop(); setSpeaking(false); return; }
      setSpeaking(true);
      Speech.speak(fullDe, { language: 'de-DE', rate: 0.92, onDone: () => setSpeaking(false), onStopped: () => setSpeaking(false), onError: () => setSpeaking(false) });
    } catch { setSpeaking(false); }
  };
  const copyAll = async () => {
    await Clipboard.setStringAsync(fullDe);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={20} color="#1E3A5F" /></Pressable>
        <View style={[styles.lvl, { backgroundColor: levelColor(t.level) }]}><Text style={styles.lvlTxt}>{t.level}</Text></View>
        <Text style={styles.barThema}>{t.thema}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.title, dark && { color: '#F1F5F9' }]}>{t.titleTr}</Text>
        <Text style={styles.titleDe}>{t.titleDe}</Text>
        <View style={styles.modeRow}>
          {([['both', 'İkisi'], ['de', 'Deutsch'], ['tr', 'Türkçe']] as [Mode, string][]).map(([m, lbl]) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, mode === m && styles.modeActive]}>
              <Text style={[styles.modeTxt, mode === m && { color: '#fff' }]}>{lbl}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.actionRow}>
          <Pressable onPress={speakAll} style={[styles.act, speaking && { backgroundColor: '#1E3A5F' }]}>
            <Ionicons name={speaking ? 'stop' : 'volume-high'} size={16} color={speaking ? '#fff' : '#1E3A5F'} />
            <Text style={[styles.actTxt, speaking && { color: '#fff' }]}>{speaking ? 'Durdur' : 'Sesli dinle'}</Text>
          </Pressable>
          <Pressable onPress={copyAll} style={styles.act}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? '#15803D' : '#1E3A5F'} />
            <Text style={[styles.actTxt, copied && { color: '#15803D' }]}>{copied ? 'Kopyalandı!' : 'Almancayı kopyala'}</Text>
          </Pressable>
        </View>
        <View style={[styles.paper, dark && styles.paperDark]}>
          {t.de.map((p, i) => (
            <View key={i} style={styles.para}>
              {(mode === 'both' || mode === 'de') && <Text style={[styles.de, dark && { color: '#F1F5F9' }]}>{p}</Text>}
              {(mode === 'both' || mode === 'tr') && <Text style={styles.tr}>{t.tr[i]}</Text>}
              {i < t.de.length - 1 && <View style={styles.pdiv} />}
            </View>
          ))}
        </View>
        <View style={styles.noteBox}>
          <View style={styles.noteHead}><Ionicons name="school" size={16} color="#B45309" /><Text style={styles.noteTitle}>Sınav kalıbı notu</Text></View>
          <Text style={styles.noteTxt}>{t.kalipNotu}</Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  lvl: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  lvlTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  barThema: { fontSize: 12, color: '#B45309', fontWeight: '700', flex: 1 },
  title: { fontSize: 23, fontWeight: '900', color: '#1E3A5F' },
  titleDe: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginTop: 3 },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  modeBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  modeActive: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  modeTxt: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  act: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 10, borderRadius: 12 },
  actTxt: { fontSize: 13, fontWeight: '700', color: '#1E3A5F' },
  paper: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginTop: 14, borderWidth: 1, borderColor: '#F1E8D5' },
  paperDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  para: { marginBottom: 4 },
  de: { fontSize: 15.5, lineHeight: 24, color: '#1E293B', fontWeight: '600' },
  tr: { fontSize: 14, lineHeight: 21, color: '#7C8DA6', marginTop: 5, fontStyle: 'italic' },
  pdiv: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  noteBox: { backgroundColor: '#FFFBEB', borderRadius: 16, padding: 15, marginTop: 14, borderWidth: 1, borderColor: '#FDE68A' },
  noteHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  noteTitle: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  noteTxt: { fontSize: 13.5, lineHeight: 20, color: '#92400E' },
});
