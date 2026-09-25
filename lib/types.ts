export type Level = 'B1' | 'B2' | 'C1';
export type Formality = 'resmi' | 'gayriresmi' | 'nötr';

export interface Category {
  id: string;
  titleTr: string;
  titleDe: string;
  descTr: string;
  icon: string;
  color: string;
}

export interface Sentence {
  id: string;
  level: Level;
  cat: string;
  de: string;
  tr: string;
  formal: Formality;
  tip?: string;
}

export const LEVELS: { id: Level; title: string; desc: string; color: string }[] = [
  { id: 'B1', title: 'B1 · Bağımsız Kullanıcı', desc: 'Günlük mektuplar, davetler, basit şikayetler', color: '#2E9E5B' },
  { id: 'B2', title: 'B2 · Akıcı Kullanıcı', desc: 'Resmi dilekçeler, başvurular, görüş yazıları', color: '#E08A00' },
  { id: 'C1', title: 'C1 · İleri Seviye', desc: 'Üst düzey resmi yazışma, edebi ve hukuki dil', color: '#C0392B' },
];

export const CATEGORIES: Category[] = [
  { id: 'anrede', titleTr: 'Hitap & Selamlama', titleDe: 'Anrede', descTr: 'Mektuba doğru hitapla başlayın', icon: 'mail-open-outline', color: '#2563EB' },
  { id: 'einleitung', titleTr: 'Giriş Cümleleri', titleDe: 'Einleitung', descTr: 'Kendinizi tanıtın, konuya girin', icon: 'play-circle-outline', color: '#7C3AED' },
  { id: 'anlass', titleTr: 'Mektup Nedeni', titleDe: 'Anlass', descTr: 'Neden yazdığınızı açıklayın', icon: 'document-text-outline', color: '#0891B2' },
  { id: 'bitte', titleTr: 'Rica, İstek & Yardım', titleDe: 'Bitte & Hilfe', descTr: 'Kibar istekler ve yardım talepleri', icon: 'hand-left-outline', color: '#DB2777' },
  { id: 'beschwerde', titleTr: 'Şikayet & Talep', titleDe: 'Beschwerde', descTr: 'Sorunu anlatın, çözüm isteyin', icon: 'alert-circle-outline', color: '#DC2626' },
  { id: 'meinung', titleTr: 'Fikir, Öneri & Deneyim', titleDe: 'Meinung', descTr: 'Görüş bildirin, öneri sunun', icon: 'chatbubbles-outline', color: '#4D7C0F' },
  { id: 'dank', titleTr: 'Teşekkür, Davet & Kutlama', titleDe: 'Dank & Einladung', descTr: 'Teşekkür edin, davet edin, kutlayın', icon: 'gift-outline', color: '#C026D3' },
  { id: 'schluss', titleTr: 'Kapanış & Veda', titleDe: 'Schluss', descTr: 'Mektubu şık bir şekilde bitirin', icon: 'checkmark-done-outline', color: '#475569' },
];

export function levelColor(l: Level): string {
  return LEVELS.find((x) => x.id === l)?.color ?? '#333';
}

export function catById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
