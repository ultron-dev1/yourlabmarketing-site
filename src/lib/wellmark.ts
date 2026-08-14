/**
 * The identity system, shared with the client portal.
 *
 * A 5×7 dot matrix read out of a microplate. Filled wells spell letters, so
 * the mark is not a fixed drawing — it is a rule. Below ~64px the 5×7 is
 * illegible, so a coarse 3×5 cut of the same alphabet takes over.
 *
 * Kept in sync with YourLabPortal/src/lib/wellmark.ts.
 */

export const GLYPH_COLS = 5;
export const GLYPH_ROWS = 7;

const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "01010", "00100", "00100", "00100", "01010", "10001"],
  Y: ["10001", "01010", "00100", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
};

export const COMPACT_COLS = 3;
export const COMPACT_ROWS = 5;

const COMPACT: Record<string, string[]> = {
  A: ["111", "101", "111", "101", "101"],
  B: ["110", "101", "110", "101", "110"],
  C: ["111", "100", "100", "100", "111"],
  D: ["110", "101", "101", "101", "110"],
  E: ["111", "100", "110", "100", "111"],
  F: ["111", "100", "110", "100", "100"],
  G: ["111", "100", "101", "101", "111"],
  H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"],
  J: ["111", "010", "010", "110", "110"],
  K: ["101", "110", "100", "110", "101"],
  L: ["100", "100", "100", "100", "111"],
  M: ["101", "111", "111", "101", "101"],
  N: ["101", "111", "111", "111", "101"],
  O: ["111", "101", "101", "101", "111"],
  P: ["111", "101", "111", "100", "100"],
  Q: ["111", "101", "101", "111", "011"],
  R: ["111", "101", "110", "101", "101"],
  S: ["111", "100", "111", "001", "111"],
  T: ["111", "010", "010", "010", "010"],
  U: ["101", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"],
  W: ["101", "101", "111", "111", "101"],
  X: ["101", "101", "010", "101", "101"],
  Y: ["101", "101", "010", "010", "010"],
  Z: ["111", "001", "010", "100", "111"],
};

export interface Well {
  col: number;
  row: number;
  filled: boolean;
}

export interface Layout {
  wells: Well[];
  cols: number;
  rows: number;
}

/**
 * Lays out `text` across the grid and returns every well, filled or not.
 * Letters are separated by one empty column.
 */
export function wellsFor(text: string, compact = false): Layout {
  const set = compact ? COMPACT : GLYPHS;
  const glyphCols = compact ? COMPACT_COLS : GLYPH_COLS;
  const rows = compact ? COMPACT_ROWS : GLYPH_ROWS;
  const blank = compact
    ? ["000", "000", "000", "000", "000"]
    : ["00000", "00000", "00000", "00000", "00000", "00000", "00000"];

  const letters = text
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3)
    .split("");

  if (!letters.length) letters.push("L");

  const cols = letters.length * glyphCols + (letters.length - 1);
  const wells: Well[] = [];

  letters.forEach((letter, i) => {
    const glyph = set[letter] ?? blank;
    const offset = i * (glyphCols + 1);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < glyphCols; col++) {
        wells.push({ col: offset + col, row, filled: glyph[row][col] === "1" });
      }
    }
    // The separator column is still a well on the plate — just empty.
    if (i < letters.length - 1) {
      for (let row = 0; row < rows; row++) {
        wells.push({ col: offset + glyphCols, row, filled: false });
      }
    }
  });

  return { wells, cols, rows };
}

/**
 * Which wells of an arbitrary grid a word occupies, centred in the grid.
 * Used by the hero plate, which is a real 96-well layout (12×8) that the
 * compact alphabet is projected onto.
 */
export function wordOnGrid(
  text: string,
  gridCols: number,
  gridRows: number,
): Set<string> {
  const { wells, cols, rows } = wellsFor(text, true);
  const dx = Math.floor((gridCols - cols) / 2);
  const dy = Math.floor((gridRows - rows) / 2);
  const on = new Set<string>();
  for (const w of wells) {
    if (!w.filled) continue;
    const c = w.col + dx;
    const r = w.row + dy;
    if (c < 0 || c >= gridCols || r < 0 || r >= gridRows) continue;
    on.add(`${c},${r}`);
  }
  return on;
}

/** Monogram for a lab: initials of the significant words. */
export function monogramFor(name: string): string {
  const words = name
    .replace(/^the\s+/i, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^(lab|group|the|of|and|for)$/i.test(w));

  const source = words.length ? words : name.replace(/^the\s+/i, "").split(/\s+/);
  return source
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
