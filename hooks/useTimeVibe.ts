// hooks/useTimeVibe.ts
import { useState, useEffect, useMemo } from 'react';
import { useTimeDemo } from '../context/TimeDemoContext';
import { getTimeOfDay, timeVibeConfig, getCurrentDayString, TimeOfDay } from '../constants/timeVibeConfig';
import { ALL_PRODUCTS, Product } from '../constants/products';

const getIconForTime = (time: TimeOfDay): string => {
  const icons: Record<TimeOfDay, string> = {
    dawn: '🌅', morning: '🌞', noon: '☀️', afternoon: '☕', evening: '🌆', night: '🌙', lateNight: '💤',
  };
  return icons[time];
};

const getSuggestionsByTag = (tag: string): Product[] => {
  const idMap: Record<string, string[]> = {
    breakfast: ['7', 'd1', 'bk1', 'f1'],
    morning: ['f1', 'd2', 'bk2', 'bv1'],
    lunch: ['m4', 'r1', 'fv3', 'm1'],
    snack: ['bv4', 'bk5', 'f1', 'bk3'],
    dinner: ['m2', 'bk4', 'b5', 'm3'],
    midnight: ['b1', 'bk4', 'bv2', 'bk1'],
  };

  const ids = idMap[tag] || [];
  let suggested = ids.map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];

  if (suggested.length < 4) {
    const fillers = ALL_PRODUCTS.filter(p => !suggested.find(s => s.id === p.id)).slice(0, 4 - suggested.length);
    suggested = [...suggested, ...fillers];
  }
  return suggested.slice(0, 4);
};

export function useTimeVibe() {
  const { getEffectiveHour, isDemoMode, demoHour } = useTimeDemo();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, setForceUpdate] = useState(0);

  // Cập nhật thời gian thực MỖI GIÂY để màu thay đổi ngay lập tức khi sang buổi mới
  useEffect(() => {
    if (isDemoMode) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setForceUpdate(prev => prev + 1);
    }, 10000); 
    return () => clearInterval(timer);
  }, [isDemoMode]);

  const effectiveHour = isDemoMode ? getEffectiveHour() : currentTime.getHours();
  const effectiveMinutes = isDemoMode ? 0 : currentTime.getMinutes();
  const timeOfDay = getTimeOfDay(effectiveHour);
  const vibe = timeVibeConfig[timeOfDay];

  const displayTime = `${effectiveHour.toString().padStart(2, '0')}:${effectiveMinutes.toString().padStart(2, '0')}`;
  const period = effectiveHour >= 12 ? 'PM' : 'AM';
  const hour12 = effectiveHour % 12 || 12;
  const headerTimeString = `${getIconForTime(timeOfDay)} ${hour12}:${effectiveMinutes.toString().padStart(2, '0')} ${period} · ${getCurrentDayString()}`;

  const suggestions = useMemo(() => {
    if (!vibe.suggestionTag) return [];
    return getSuggestionsByTag(vibe.suggestionTag);
  }, [vibe.suggestionTag]);

  return {
    timeOfDay,
    vibe,
    effectiveHour,
    displayTime,
    isDemoMode,
    demoHour,
    headerTimeString,
    suggestions,
  };
}