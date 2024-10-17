import hexRgb from 'hex-rgb';
import rgbHex from 'rgb-hex';

export default function blendColors(fgColor = '#ffffff', opacity = 1, bgColor = '#ffffff') {
  const fgRgb = hexRgb(fgColor, { format: 'array' });
  const bgRgb = hexRgb(bgColor, { format: 'array' });

  const blendedRgb = fgRgb.slice(0, 3).map<number>((colFg, idx) => opacity * colFg + (1 - opacity) * (bgRgb[idx] || 255)) as [number, number, number];

  return `#${rgbHex(...blendedRgb)}`;
}
