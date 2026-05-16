// constants/timeVibeConfig.ts
export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'lateNight';

export interface RitualCard { title: string; subtitle: string; desc: string; productId: string | null; }
export interface TimeVibe { headerLabel: string; vibePhrase: string; ritualCard: RitualCard | null; suggestionTag: string | null; 
  flashSale: boolean; backgroundColor: string; accentColor: string; textColor: string; cardBgColor: string; borderColor: string; }

export const timeVibeConfig: Record<TimeOfDay, TimeVibe> = {
  dawn: {
    headerLabel: "🌅 Rạng sáng", vibePhrase: "Bình minh rồi, dậy pha cà phê thôi ☕",
    ritualCard: { title: "☀️ BÌNH MINH", subtitle: "Khởi đầu ngày mới", desc: "Cà phê phin -15%", productId: "b1" },
    suggestionTag: "breakfast", flashSale: false, backgroundColor: "#FFF5E6", accentColor: "#B85C00", textColor: "#432818", cardBgColor: "#FFFAF4", borderColor: "#E8D5B7",
  },
  morning: {
    headerLabel: "🌞 Buổi sáng", vibePhrase: "Sáng khoẻ - cả ngày vui 🚀",
    ritualCard: { title: "🍳 BỮA SÁNG", subtitle: "Năng lượng cho ngày mới", desc: "Trứng + sữa giảm 10%", productId: "7" },
    suggestionTag: "morning", flashSale: false, backgroundColor: "#FDFCF0", accentColor: "#27AE60", textColor: "#1D3124", cardBgColor: "#FFFFFF", borderColor: "#E0E6D8",
  },
  noon: {
    headerLabel: "☀️ Buổi trưa", vibePhrase: "Trưa rồi, ăn gì để không ngủ gật? 😴",
    ritualCard: { title: "🍚 CƠM TRƯA", subtitle: "Giao nhanh 30 phút", desc: "Cơm + thịt kho 55k", productId: "m4" },
    suggestionTag: "lunch", flashSale: false, backgroundColor: "#FFF9E3", accentColor: "#E67E22", textColor: "#5E3008", cardBgColor: "#FFFFFF", borderColor: "#F0E8CC",
  },
  afternoon: {
    headerLabel: "☕ Buổi chiều", vibePhrase: "Chiều chậm, trà sữa thôi 🧋",
    ritualCard: { title: "🧋 TRÀ CHIỀU", subtitle: "Sugar rush", desc: "Milk tea + bánh ngọt -20%", productId: "bv4" },
    suggestionTag: "snack", flashSale: false, backgroundColor: "#F5E6F0", accentColor: "#9B59B6", textColor: "#58334f", cardBgColor: "#FFFFFF", borderColor: "#E8D5E0",
  },
  evening: {
    headerLabel: "🌆 Buổi tối", vibePhrase: "Tối rồi, xem phim với bia và khoai 🍺",
    ritualCard: { title: "🍻 TỐI VIBE", subtitle: "Snack box", desc: "Bia + khoai tây chiên -25%", productId: "bk4" },
    suggestionTag: "dinner", flashSale: true, backgroundColor: "#1A1A2E", accentColor: "#F4A261", textColor: "#E0E0FF", cardBgColor: "#252545", borderColor: "#3A3A5A",
  },
  night: {
    headerLabel: "🌙 Đêm khuya", vibePhrase: "🚨 Kho đóng lúc 00:00 \n CHỐT ĐƠN NGAY!!",
    ritualCard: { title: "⚡ LAST CALL", subtitle: "Nổ tung trước nửa đêm", desc: "Freeship + giảm thêm 10% — hết 00:00 là thôi!", productId: null },
    suggestionTag: "midnight", flashSale: true, backgroundColor: "#0F0F1B", accentColor: "#A29BFE", textColor: "#FFFFFF", cardBgColor: "#1C1C2D", borderColor: "#2D2D44",
  },
  lateNight: {
    headerLabel: "", vibePhrase: "Khuya rồi, đi ngủ thôi!!! 🥱😴",
    ritualCard: null, suggestionTag: null, flashSale: false, backgroundColor: "#05050A", accentColor: "#636E72", textColor: "#B2BEC3", cardBgColor: "#12121A", borderColor: "#222230",
  },
};

export function getCurrentHour(): number { return new Date().getHours(); }

export function getCurrentDayString(): string {
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const today = new Date();
  return `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}`;
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 4 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 13) return 'noon';
  if (hour >= 13 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 24) return 'night';
  return 'lateNight';
}