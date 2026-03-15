import React from 'react';
import type { CosmeticDefect } from '../types';
import guitarSvgRaw from '../assets/Guitar_1.svg?raw';

const DEFECT_COLORS: Record<string, string> = {
  'С': '#dc2626',
  'П': '#ea580c',
  'Г': '#ca8a04',
  'Т': '#881337',
};

const SVG_VB_WIDTH = 566.929;
const SVG_VB_HEIGHT = 708.661;

interface Props {
  defects: CosmeticDefect[];
}

export function GuitarMapStatic({ defects }: Props) {
  const innerSvg = guitarSvgRaw
    .replace(/<\?xml[^?]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[^>]*>/s, '')
    .replace(/<\/svg>\s*$/, '');

  const overlays = defects
    .map(d => {
      const cx = (d.x / 100) * SVG_VB_WIDTH;
      const cy = (d.y / 100) * SVG_VB_HEIGHT;
      const color = DEFECT_COLORS[d.type] || '#000';
      return `<circle cx="${cx}" cy="${cy}" r="12" fill="${color}33" stroke="${color}" stroke-width="2.5"/>` +
        `<text x="${cx}" y="${cy}" dominant-baseline="middle" text-anchor="middle" ` +
        `font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="${color}">${d.type}</text>`;
    })
    .join('');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${SVG_VB_WIDTH} ${SVG_VB_HEIGHT}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      dangerouslySetInnerHTML={{ __html: innerSvg + overlays }}
    />
  );
}
