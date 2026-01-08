import type { Rgb, Color } from 'culori';
import { converter, formatHex, blend } from 'culori';

const COLOR_WHITE_RGB: Rgb = { alpha: 1, r: 1, g: 1, b: 1, mode: 'rgb' };

export default function blendColors(
  fgColor: Color | string = COLOR_WHITE_RGB,
  opacity: number = 1,
  bgColor: Color | string = COLOR_WHITE_RGB,
): string {
  const fgRgb = converter('rgb')(fgColor) || COLOR_WHITE_RGB;
  const bgRgb = converter('rgb')(bgColor) || COLOR_WHITE_RGB;

  const fgRgbTransparent: Rgb = {
    mode: 'rgb',
    alpha: opacity,
    r: fgRgb?.r,
    g: fgRgb?.g,
    b: fgRgb?.b,
  };

  const blendedRgb = blend([bgRgb, fgRgbTransparent]);
  const blendedHex = formatHex(blendedRgb);

  return blendedHex;
}
