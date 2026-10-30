import { describe, expect, it } from "vitest";
import {
  DIFFICULTY_LABELS,
  READING_LEVELS,
  firstName,
  formatDate,
  formatNumber,
  readingLevelLabel,
} from "../lib/format.js";

describe("formatDate", () => {
  it("nagbabalik ng gitling kapag walang halaga", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDate("hindi-petsa")).toBe("—");
  });

  it("gumagamit ng maikling buwan sa Filipino", () => {
    const value = formatDate("2026-08-24T02:00:00.000Z");
    expect(value).toMatch(/Ago/);
    expect(value).toContain("2026");
  });

  it("may oras kapag hiniling", () => {
    const withTime = formatDate("2026-08-24T02:00:00.000Z", { withTime: true });
    const withoutTime = formatDate("2026-08-24T02:00:00.000Z");
    expect(withTime.length).toBeGreaterThan(withoutTime.length);
  });
});

describe("formatNumber", () => {
  it("nagbabalik ng 0 sa walang laman", () => {
    expect(formatNumber(null)).toBe("0");
    expect(formatNumber(undefined)).toBe("0");
  });

  it("naglalagay ng separator sa libuhan", () => {
    expect(formatNumber(1200)).toBe("1,200");
  });
});

describe("firstName", () => {
  it("kinukuha ang unang salita", () => {
    expect(firstName("Siri Dela Cruz")).toBe("Siri");
  });

  it("may fallback kapag blangko", () => {
    expect(firstName("")).toBe("Mag-aaral");
    expect(firstName("   ")).toBe("Mag-aaral");
  });
});

describe("mga antas ng pagbasa", () => {
  it("may tatlong antas na Filipino ang label", () => {
    expect(READING_LEVELS).toHaveLength(3);
    expect(READING_LEVELS.map((level) => level.label)).toEqual([
      "Malayang Pagbasa",
      "May Gabay na Pagbasa",
      "Nahihirapang Pagbasa",
    ]);
  });

  it("tumutugma ang paglalarawan sa pagkakasunod-sunod ng teksto", () => {
    // Ang Malayang Pagbasa ay para sa mag-aaral na kaya nang bumasa nang
    // mag-isa, kaya buo ang teksto; ang Nahihirapan ang may pinakamaikling
    // pangungusap. Hindi dapat baliktad ang dalawa.
    const byKey = Object.fromEntries(READING_LEVELS.map((level) => [level.value, level]));
    expect(byKey.independent.description).toMatch(/buong teksto/i);
    expect(byKey.frustration.description).toMatch(/napakaikling pangungusap/i);
  });

  it("hindi nagsasabi na sinusukat ng HASA ang kakayahan", () => {
    const text = READING_LEVELS.map((level) => `${level.label} ${level.description}`)
      .join(" ")
      .toLowerCase();
    const forbidden = ["sinusukat", "sinusuri ang antas", "diagnos", "hinuhulaan"];
    for (const word of forbidden) {
      expect(text).not.toContain(word);
    }
  });

  it("nagbibigay ng label para sa kilalang key at fallback para sa hindi", () => {
    expect(readingLevelLabel("instructional")).toBe("May Gabay na Pagbasa");
    expect(readingLevelLabel("wala")).toBe("Hindi pa napili");
    expect(readingLevelLabel(undefined)).toBe("Hindi pa napili");
  });

  it("Filipino ang lahat ng label ng difficulty", () => {
    expect(DIFFICULTY_LABELS).toEqual({
      madali: "Madali",
      katamtaman: "Katamtaman",
      mahirap: "Mahirap",
    });
  });
});
