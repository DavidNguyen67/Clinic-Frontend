export type Slot = { start: string; end: string; label: string };

export function buildSlots(ranges: [number, number][]): Slot[] {
  return ranges.flatMap(([from, to]) =>
    Array.from({ length: to - from }, (_, i) => {
      const h = (from + i).toString().padStart(2, "0");
      const h2 = (from + i + 1).toString().padStart(2, "0");
      return { start: `${h}:00`, end: `${h2}:00`, label: `${h}:00 – ${h2}:00` };
    })
  );
}

export const MORNING_SLOTS = buildSlots([[8, 12]]);
export const AFTERNOON_SLOTS = buildSlots([[14, 17]]);
