export const COLOR_HEX_MAP: Record<string, string> = {
  navy: '#1e3a8a',
  slate: '#262626',
  emerald: '#064e3b',
  wine: '#4c0519',
  violet: '#1e1b4b',
  bronze: '#451a03',
};

export const HEX_TO_COLOR_ID: Record<string, string> = {
  '#1e3a8a': 'navy',
  '#262626': 'slate',
  '#064e3b': 'emerald',
  '#4c0519': 'wine',
  '#1e1b4b': 'violet',
  '#451a03': 'bronze',
};

export function normalizeCardColor(color?: string | null): string {
  if (!color) return 'navy';
  const lower = color.toLowerCase();
  if (HEX_TO_COLOR_ID[lower]) return HEX_TO_COLOR_ID[lower];
  if (COLOR_HEX_MAP[lower]) return lower;
  return 'navy';
}

