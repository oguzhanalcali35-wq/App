import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = 'brief_favs_v1';
const PROG_KEY = 'brief_prog_v1';

export interface Progress {
  studiedIds: string[];
  quizBest: Record<string, number>;
  quizPlays: number;
}

interface StoreCtx {
  favorites: string[];
  toggleFav: (id: string) => void;
  isFav: (id: string) => boolean;
  progress: Progress;
  markStudied: (id: string) => void;
  saveQuizScore: (level: string, score: number) => void;
}

const Ctx = createContext<StoreCtx>({
  favorites: [],
  toggleFav: () => {},
  isFav: () => false,
  progress: { studiedIds: [], quizBest: {}, quizPlays: 0 },
  markStudied: () => {},
  saveQuizScore: () => {},
});

export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress>({ studiedIds: [], quizBest: {}, quizPlays: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [f, p] = await Promise.all([AsyncStorage.getItem(FAV_KEY), AsyncStorage.getItem(PROG_KEY)]);
        if (f) setFavorites(JSON.parse(f));
        if (p) setProgress(JSON.parse(p));
      } catch {}
    })();
  }, []);

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(FAV_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const markStudied = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.studiedIds.includes(id)) return prev;
      const next = { ...prev, studiedIds: [...prev.studiedIds, id] };
      AsyncStorage.setItem(PROG_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const saveQuizScore = useCallback((level: string, score: number) => {
    setProgress((prev) => {
      const best = Math.max(prev.quizBest[level] ?? 0, score);
      const next = { ...prev, quizBest: { ...prev.quizBest, [level]: best }, quizPlays: prev.quizPlays + 1 };
      AsyncStorage.setItem(PROG_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ favorites, toggleFav, isFav: (id) => favorites.includes(id), progress, markStudied, saveQuizScore }}>
      {children}
    </Ctx.Provider>
  );
}
