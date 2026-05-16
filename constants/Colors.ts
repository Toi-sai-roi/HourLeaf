// constants/Colors.ts
import { Platform } from 'react-native';

// ─── HOURLEAF DARK PALETTE ───────────────────────────────────────────────
export const Palette = {
  bg: '#0D0B14', card: '#1A1530', cardHover: '#221D3A', border: '#2A2240', borderSub: '#1E1A33',
  purple: '#7C6EF5', purpleSub: '#9B8FDF', purpleDim: '#7C6EF520', purpleMid: '#7C6EF540',
  gold: '#C9A84C', goldDim: '#C9A84C20', goldMid: '#C9A84C40',
  textPrimary: '#F5F0FF', textSecondary: '#9B8FDF', textDisabled: '#4A3F7A',
  success: '#4CAF7A', danger: '#E25555', warning: '#C9A84C',
} as const;

// ─── COLORS OBJECT ────────────────────────────────────────────────────
const commonColors = { text: Palette.textPrimary, background: Palette.bg, tint: Palette.purple, icon: Palette.purpleSub, tabIconDefault: Palette.textDisabled, tabIconSelected: Palette.purple };
export const Colors = { light: commonColors, dark: commonColors } as const;

// ─── FONTS ────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: { sans: 'System', serif: 'Georgia', rounded: 'System', mono: 'Menlo' },
  default: { sans: 'Roboto', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", serif: "Georgia, 'Times New Roman', serif", rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif", mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace" },
});

// ─── SPACING / RADIUS ─────────────────────────────────────────────────
export const Radius = { sm: 6, md: 10, lg: 14, xl: 20, full: 999 } as const;
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────
const defaultFont = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string;
export const Typography = {
  default: { fontFamily: defaultFont, fontSize: 14, lineHeight: 20 },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
} as const;