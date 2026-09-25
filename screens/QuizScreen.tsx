import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Level } from '../lib/types';
import { SENTENCES } from '../lib/data';
import { useStore } from '../lib/store';

interface Q { de: string; tr: string; options: string[]; answer: string; askDe: boolean; level: Level; }

function buildQuiz(level: Level | 'Karışık'): Q[] {
  const pool = level === 'Karışık' ? SENTENCES : SENTENCES.filter((s) => s.level === level);
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
  return shuffled.map((s) => {
    const askDe = Math.random() > 0.5;
    const others = [...pool].filter((x) => x.id !== s.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const answer = askDe ? s.tr : s.de;
    const opts = [...others.map((o) => (askDe ? o.tr : o.de)), answer].sort(() => Math.random() - 0.5);
    return { de: s.de, tr: s.tr, options: opts, answer, askDe, level: s.level };
  });
}

export default function QuizScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { saveQuizScore, progress } = useStore();
  const [level, setLevel] = useState<Level | 'Karışık'>('Karışık');
  const [quiz, setQuiz] = useState<Q[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = (l: Level | 'Karışık') => {
    setLevel(l);
    setQuiz(buildQuiz(l));
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const pick = (opt: string) => {
    if (picked || !quiz) return;
    setPicked(opt);
    if (opt === quiz[idx].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (!quiz) return;
    if (idx + 1 >= quiz.length) {
      setDone(true);
      saveQuizScore(level, score + (picked === quiz[idx].answer ? 1 : 0));
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const finalScore = done && quiz ? score : score;

  // ── start screen ──
  if (!quiz) {
    return (
      <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={[styles.title, dark && { color: '#F1F5F9' }]}>Seviye Testi</Text>
          <Text style={styles.sub}>10 soru · Almanca ⇄ Türkçe · Yanlışlar kırmızıyla gösterilir</Text>
          <View style={styles.bestRow}>
            {['B1', 'B2', 'C1', 'Karışık'].map((l) => (
              <View key={l} style={[styles.bestCard, dark && styles.cardDark]}>
                <Text style={styles.bestLvl}>{l}</Text>
                <Text style={styles.bestScore}>{progress.quizBest[l] != null ? `${progress.quizBest[l]}/10` : '—'}</Text>
                <Text style={styles.bestLbl}>en iyi</Text>
              </View>
            ))}
          </View>
          {(['Karışık', 'B1', 'B2', 'C1'] as const).map((l) => (
            <Pressable key={l} onPress={() => start(l)} style={[styles.startBtn, l === 'Karışık' && styles.startMain]}>
              <Ionicons name={l === 'Karışık' ? 'shuffle' : 'play-circle'} size={24} color={l === 'Karışık' ? '#fff' : '#1E3A5F'} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.startT, l === 'Karışık' && { color: '#fff' }]}>{l === 'Karışık' ? 'Karışık test başlat' : `${l} testi başlat`}</Text>
                <Text style={[styles.startS, l === 'Karışık' && { color: '#FDE68A' }]}>{l === 'Karışık' ? 'Tüm seviyelerden 10 soru' : `${SENTENCES.filter((s) => s.level === l).length} cümle havuzundan 10 soru`}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={l === 'Karışık' ? '#fff' : '#94A3B8'} />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── result screen ──
  if (done) {
    const pct = Math.round((finalScore / quiz.length) * 100);
    const msg = pct >= 80 ? 'Mükemmel! Sınava hazırsın 🎉' : pct >= 50 ? 'İyi gidiyorsun, biraz daha pratik! 💪' : 'Cümlelere göz atıp tekrar dene 📚';
    return (
      <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
        <View style={styles.resultWrap}>
          <View style={styles.ring}><Text style={styles.ringTxt}>{finalScore}/{quiz.length}</Text></View>
          <Text style={[styles.rTitle, dark && { color: '#F1F5F9' }]}>{msg}</Text>
          <Text style={styles.rSub}>{level} testi · En iyi skor: {Math.max(progress.quizBest[level] ?? 0, finalScore)}/10</Text>
          <Pressable onPress={() => start(level)} style={styles.retry}><Ionicons name="refresh" size={18} color="#fff" /><Text style={styles.retryTxt}>Tekrar oyna</Text></Pressable>
          <Pressable onPress={() => setQuiz(null)} style={styles.backBtn}><Text style={styles.backTxt}>Seviye seçimine dön</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const q = quiz[idx];
  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: '#0F1522' }]} edges={['top']}>
      <View style={{ padding: 16, flex: 1 }}>
        <View style={styles.qTop}>
          <Text style={styles.qCount}>Soru {idx + 1}/{quiz.length}</Text>
          <Text style={styles.qScore}>✓ {score}</Text>
        </View>
        <View style={styles.pbar}><View style={[styles.pfill, { width: `${((idx + (picked ? 1 : 0)) / quiz.length) * 100}%` }]} /></View>
        <View style={[styles.qCard, dark && styles.cardDark]}>
          <View style={styles.qHintRow}>
            <Text style={styles.qHint}>{q.askDe ? '🇩🇪 Bu cümlenin Türkçesi nedir?' : '🇹🇷 Bu cümlenin Almancası nedir?'}</Text>
            <View style={styles.qLvl}><Text style={styles.qLvlTxt}>{q.level}</Text></View>
          </View>
          <Text style={[styles.qText, dark && { color: '#F1F5F9' }]}>{q.askDe ? q.de : q.tr}</Text>
        </View>
        {q.options.map((opt, i) => {
          const isAns = opt === q.answer;
          const isPick = opt === picked;
          let bg = dark ? '#1C2433' : '#fff';
          let border = '#E2E8F0';
          if (picked && isAns) { bg = '#DCFCE7'; border = '#16A34A'; }
          else if (picked && isPick) { bg = '#FEE2E2'; border = '#DC2626'; }
          return (
            <Pressable key={i} onPress={() => pick(opt)} style={[styles.opt, { backgroundColor: bg, borderColor: border }]}>
              <View style={styles.optLetter}><Text style={styles.optLetterTxt}>{['A', 'B', 'C', 'D'][i]}</Text></View>
              <Text style={styles.optTxt}>{opt}</Text>
              {picked && isAns ? <Ionicons name="checkmark-circle" size={20} color="#16A34A" /> : null}
              {picked && isPick && !isAns ? <Ionicons name="close-circle" size={20} color="#DC2626" /> : null}
            </Pressable>
          );
        })}
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => (picked ? next() : null)} style={[styles.nextBtn, !picked && { opacity: 0.4 }]}>
          <Text style={styles.nextTxt}>{idx + 1 >= quiz.length ? 'Sonucu gör' : 'Sonraki soru'}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
        <Pressable onPress={() => setQuiz(null)} style={{ alignItems: 'center', marginTop: 10 }}><Text style={styles.quit}>Testi bitir</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9EF' },
  cardDark: { backgroundColor: '#1C2433', borderColor: '#2D3A52' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E3A5F' },
  sub: { fontSize: 13, color: '#94A3B8', marginTop: 3, marginBottom: 14 },
  bestRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  bestCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#F1E8D5' },
  bestLvl: { fontSize: 12, fontWeight: '800', color: '#B45309' },
  bestScore: { fontSize: 17, fontWeight: '900', color: '#1E3A5F', marginTop: 2 },
  bestLbl: { fontSize: 10, color: '#94A3B8' },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F1E8D5' },
  startMain: { backgroundColor: '#B45309', borderColor: '#B45309' },
  startT: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  startS: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  qTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qCount: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  qScore: { fontSize: 13, fontWeight: '800', color: '#15803D' },
  pbar: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8, marginBottom: 14, overflow: 'hidden' },
  pfill: { height: 6, backgroundColor: '#B45309', borderRadius: 3 },
  qCard: { backgroundColor: '#1E3A5F', borderRadius: 18, padding: 18, marginBottom: 14 },
  qHintRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qHint: { color: '#FCD34D', fontSize: 12.5, fontWeight: '700' },
  qLvl: { backgroundColor: '#C9A227', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  qLvlTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  qText: { color: '#fff', fontSize: 17, fontWeight: '700', lineHeight: 25 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, padding: 13, marginBottom: 9, borderWidth: 1.5 },
  optLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  optLetterTxt: { fontWeight: '800', fontSize: 13, color: '#475569' },
  optTxt: { flex: 1, fontSize: 14, color: '#1E293B', lineHeight: 20 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#B45309', borderRadius: 16, paddingVertical: 15 },
  nextTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  quit: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  ring: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#FCD34D' },
  ringTxt: { color: '#fff', fontSize: 28, fontWeight: '900' },
  rTitle: { fontSize: 20, fontWeight: '900', color: '#1E3A5F', textAlign: 'center', marginTop: 18 },
  rSub: { fontSize: 13, color: '#94A3B8', marginTop: 6 },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#B45309', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14, marginTop: 22 },
  retryTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  backBtn: { marginTop: 12, padding: 10 },
  backTxt: { color: '#64748B', fontWeight: '600', fontSize: 13 },
});
