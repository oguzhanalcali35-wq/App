import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { Sentence, catById, levelColor } from '../lib/types';
import { useStore } from '../lib/store';

const FORMAL_LABEL: Record<string, { tr: string; icon: string }> = {
  resmi: { tr: 'Resmi', icon: 'briefcase-outline' },
  gayriresmi: { tr: 'Samimi', icon: 'heart-outline' },
  nötr: { tr: 'Nötr', icon: 'swap-horizontal-outline' },
};

export default function SentenceCard({ item, index }: { item: Sentence; index?: number }) {
  const { isFav, toggleFav, markStudied } = useStore();
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const fav = isFav(item.id);
  const cat = catById(item.cat);
  const lc = levelColor(item.level);
  const formal = FORMAL_LABEL[item.formal];

  const copy = async () => {
    await Clipboard.setStringAsync(`${item.de}\n${item.tr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const speak = () => {
    try {
      if (speaking) {
        Speech.stop();
        setSpeaking(false);
        return;
      }
      setSpeaking(true);
      Speech.speak(item.de, {
        language: 'de-DE',
        rate: 0.92,
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch {
      setSpeaking(false);
    }
  };

  return (
    <View style={[styles.card, dark && styles.cardDark]}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.levelBadge, { backgroundColor: lc }]}>
            <Text style={styles.levelTxt}>{item.level}</Text>
          </View>
          <View style={[styles.catBadge, { backgroundColor: cat.color + '18' }]}>
            <Ionicons name={cat.icon as any} size={12} color={cat.color} />
            <Text style={[styles.catTxt, { color: cat.color }]}>{cat.titleTr}</Text>
          </View>
        </View>
        <Pressable onPress={() => toggleFav(item.id)} hitSlop={8} style={[styles.favBtn, fav && styles.favActive]}>
          <Ionicons name={fav ? 'bookmark' : 'bookmark-outline'} size={18} color={fav ? '#fff' : '#B45309'} />
        </Pressable>
      </View>

      <Text style={[styles.de, dark && styles.deDark]}>{item.de}</Text>
      <View style={styles.trWrap}>
        <View style={styles.trLine} />
        <Text style={[styles.tr, dark && styles.trDark]}>{item.tr}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.formalPill}>
          <Ionicons name={formal.icon as any} size={12} color="#64748B" />
          <Text style={styles.formalTxt}>{formal.tr}</Text>
        </View>
        {item.tip ? (
          <Pressable onPress={() => { setShowTip(!showTip); markStudied(item.id); }} style={styles.tipBtn}>
            <Ionicons name={showTip ? 'chevron-up' : 'bulb-outline'} size={13} color="#B45309" />
            <Text style={styles.tipBtnTxt}>{showTip ? 'İpucunu gizle' : 'Dilbilgisi ipucu'}</Text>
          </Pressable>
        ) : null}
      </View>

      {showTip && item.tip ? (
        <View style={styles.tipBox}>
          <Ionicons name="bulb" size={14} color="#B45309" />
          <Text style={styles.tipTxt}>{item.tip}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={speak} style={[styles.actBtn, speaking && styles.actActive]}>
          <Ionicons name={speaking ? 'stop' : 'volume-high-outline'} size={16} color={speaking ? '#fff' : '#1E3A5F'} />
          <Text style={[styles.actTxt, speaking && { color: '#fff' }]}>{speaking ? 'Durdur' : 'Dinle'}</Text>
        </Pressable>
        <Pressable onPress={copy} style={styles.actBtn}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? '#15803D' : '#1E3A5F'} />
          <Text style={[styles.actTxt, copied && { color: '#15803D' }]}>{copied ? 'Kopyalandı!' : 'Kopyala'}</Text>
        </Pressable>
        <Pressable onPress={() => markStudied(item.id)} style={styles.actBtn}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#1E3A5F" />
          <Text style={styles.actTxt}>Öğrendim</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1E8D5',
  },
  cardDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  levelBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  levelTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catTxt: { fontSize: 11, fontWeight: '700' },
  favBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  favActive: { backgroundColor: '#B45309' },
  de: { fontSize: 16.5, fontWeight: '700', color: '#1E293B', lineHeight: 24 },
  deDark: { color: '#F1F5F9' },
  trWrap: { flexDirection: 'row', marginTop: 8, gap: 8 },
  trLine: { width: 3, borderRadius: 2, backgroundColor: '#F59E0B' },
  tr: { flex: 1, fontSize: 14.5, color: '#475569', lineHeight: 21 },
  trDark: { color: '#B6C2D2' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  formalPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20 },
  formalTxt: { fontSize: 11.5, color: '#64748B', fontWeight: '600' },
  tipBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tipBtnTxt: { fontSize: 12.5, color: '#B45309', fontWeight: '700' },
  tipBox: { flexDirection: 'row', gap: 8, backgroundColor: '#FFFBEB', borderRadius: 12, padding: 10, marginTop: 10, borderWidth: 1, borderColor: '#FDE68A' },
  tipTxt: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 9, borderRadius: 12 },
  actActive: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  actTxt: { fontSize: 13, fontWeight: '700', color: '#1E3A5F' },
});
