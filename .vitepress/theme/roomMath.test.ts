import { describe, expect, it } from "vitest";
import { roomMath } from "./roomMath";

describe("roomMath", () => {
  it("matches the article's 23 by 10 by 9 foot example", () => {
    expect(roomMath(23, 10, 9, 2, 350)).toEqual({
      perimeter: 66,
      wallArea: 594,
      ceilingArea: 230,
      wallGallons: 4,
      ceilingGallons: 2,
    });
  });

  it("does not round an exact gallon count up", () => {
    expect(roomMath(10, 10, 8.75, 1, 350).wallGallons).toBe(1);
  });

  it("treats blank, negative and zero inputs as zero", () => {
    expect(roomMath(Number.NaN, -4, 9, 2, 0)).toEqual({
      perimeter: 0,
      wallArea: 0,
      ceilingArea: 0,
      wallGallons: 0,
      ceilingGallons: 0,
    });
  });
});
