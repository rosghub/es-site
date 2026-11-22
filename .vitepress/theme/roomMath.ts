export type RoomMath = {
  perimeter: number;
  wallArea: number;
  ceilingArea: number;
  wallGallons: number;
  ceilingGallons: number;
};

// Blank or negative inputs count as zero so a half-typed form still adds up.
function measure(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

// Paint comes in whole cans. The tolerance keeps float noise like
// 2.0000000001 from buying an extra gallon.
function gallons(area: number, coats: number, spreadRate: number): number {
  if (spreadRate <= 0) {
    return 0;
  }
  return Math.ceil((area * coats) / spreadRate - 1e-9);
}

export function roomMath(
  length: number,
  width: number,
  height: number,
  coats: number,
  spreadRate: number
): RoomMath {
  const [l, w, h, c, s] = [length, width, height, coats, spreadRate].map(measure);
  const perimeter = 2 * (l + w);
  const wallArea = perimeter * h;
  const ceilingArea = l * w;
  return {
    perimeter,
    wallArea,
    ceilingArea,
    wallGallons: gallons(wallArea, c, s),
    ceilingGallons: gallons(ceilingArea, c, s),
  };
}
