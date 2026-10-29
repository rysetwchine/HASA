import { describe, it, expect } from "vitest";
import {
  PROGRESS_STORAGE_KEY,
  clearStoredProgress,
  createInitialProgress,
  getBadgeStates,
  loadProgress,
  recordActivityResult,
  saveProgress,
} from "../services/progressStore.js";
import { getLevelProgress } from "../data/demoData.js";

function makeActivity(id, xp = 25) {
  return {
    id,
    title: `Activity ${id}`,
    xp,
    passPercent: 60,
    questions: [{ id: `${id}-q1` }],
  };
}

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
    read: (key) => map.get(key) ?? null,
  };
}

describe("progress store", () => {
  it("nagsisimula sa demo XP at streak nang walang badge", () => {
    const state = createInitialProgress(new Date("2026-10-29T10:00:00"));

    expect(state.xp).toBe(1200);
    expect(state.streak).toBe(4);
    expect(getLevelProgress(state.xp).level).toBe(4);
    expect(getBadgeStates(state).every((badge) => !badge.earned)).toBe(true);
  });

  it("nagbibigay ng XP isang beses lamang at hindi sa retry", () => {
    const initial = createInitialProgress(new Date("2026-10-29T08:00:00"));
    const activity = makeActivity("ch-test");
    const completedAt = new Date("2026-10-29T09:00:00");

    const first = recordActivityResult(initial, {
      activity,
      correct: 4,
      total: 5,
      completedAt,
    });

    expect(first.result.passed).toBe(true);
    expect(first.result.firstCompletion).toBe(true);
    expect(first.result.activityXp).toBe(25);
    expect(first.result.badgeXp).toBe(70);
    expect(first.result.xpAwarded).toBe(95);
    expect(first.state.xp).toBe(1295);
    expect(first.state.streak).toBe(5);
    expect(first.state.history[0].completedAt).toBe(completedAt.toISOString());
    expect(first.state.completions["ch-test"].completedAt).toBe(
      completedAt.toISOString(),
    );
    expect(
      getBadgeStates(first.state).find((badge) => badge.id === "b1")?.earned,
    ).toBe(true);

    const retry = recordActivityResult(first.state, {
      activity,
      correct: 5,
      total: 5,
      completedAt: new Date("2026-10-29T09:10:00"),
    });

    expect(retry.result.alreadyCompleted).toBe(true);
    expect(retry.result.firstCompletion).toBe(false);
    expect(retry.result.xpAwarded).toBe(0);
    expect(retry.state.xp).toBe(1295);
    expect(retry.state.streak).toBe(5);
    expect(retry.result.bestCorrect).toBe(5);
    expect(retry.result.attempts).toBe(2);
  });

  it("nagbubukas ng badge XP sa tamang bilang ng natapos", () => {
    let state = createInitialProgress(new Date("2026-10-29T08:00:00"));
    const start = new Date("2026-10-29T09:00:00").getTime();

    const results = [];

    ["ch-a", "ch-b", "ch-c", "ch-d", "ch-e"].forEach((id, index) => {
      const result = recordActivityResult(state, {
        activity: makeActivity(id),
        correct: 4,
        total: 5,
        completedAt: new Date(start + index * 60_000),
      });
      results.push(result);
      state = result.state;
    });

    const badges = getBadgeStates(state);
    expect(state.xp).toBe(1545);
    expect(badges.find((badge) => badge.id === "b1")?.earned).toBe(true);
    expect(badges.find((badge) => badge.id === "b2")?.earned).toBe(true);
    expect(badges.find((badge) => badge.id === "b3")?.earned).toBe(true);
    expect(results[0].result.leveledUp).toBe(false);
    expect(results[4].result.leveledUp).toBe(true);
  });

  it("hindi nagbibigay ng XP kapag bumagsak, at nagbibigay kapag pumasa sa retry", () => {
    const initial = createInitialProgress(new Date("2026-10-29T08:00:00"));
    const activity = makeActivity("ch-fail");

    const failed = recordActivityResult(initial, {
      activity,
      correct: 2,
      total: 5,
      completedAt: new Date("2026-10-29T09:00:00"),
    });

    expect(failed.result.passed).toBe(false);
    expect(failed.result.firstCompletion).toBe(false);
    expect(failed.result.xpAwarded).toBe(0);
    expect(failed.state.xp).toBe(1200);
    expect(failed.state.streak).toBe(4);

    const passed = recordActivityResult(failed.state, {
      activity,
      correct: 4,
      total: 5,
      completedAt: new Date("2026-10-29T09:05:00"),
    });

    expect(passed.result.firstCompletion).toBe(true);
    expect(passed.result.xpAwarded).toBe(95);
    expect(passed.state.xp).toBe(1295);
    expect(passed.state.streak).toBe(5);
  });

  it("hindi nadaragdagan ang streak nang dalawang beses sa parehong araw", () => {
    let state = createInitialProgress(new Date("2026-10-29T08:00:00"));

    state = recordActivityResult(state, {
      activity: makeActivity("day-1a"),
      correct: 4,
      total: 5,
      completedAt: new Date("2026-10-29T09:00:00"),
    }).state;
    expect(state.streak).toBe(5);

    state = recordActivityResult(state, {
      activity: makeActivity("day-1b"),
      correct: 4,
      total: 5,
      completedAt: new Date("2026-10-29T15:00:00"),
    }).state;
    expect(state.streak).toBe(5);

    state = recordActivityResult(state, {
      activity: makeActivity("day-2"),
      correct: 4,
      total: 5,
      completedAt: new Date("2026-10-30T09:00:00"),
    }).state;
    expect(state.streak).toBe(6);

    state = recordActivityResult(state, {
      activity: makeActivity("day-gap"),
      correct: 4,
      total: 5,
      completedAt: new Date("2026-11-02T09:00:00"),
    }).state;
    expect(state.streak).toBe(1);
  });

  it("nagse-save at nagre-restore ng progress", () => {
    const storage = createMemoryStorage();
    const initial = createInitialProgress(new Date("2026-10-29T08:00:00"));
    const { state } = recordActivityResult(initial, {
      activity: makeActivity("persist"),
      correct: 5,
      total: 5,
      completedAt: new Date("2026-10-29T09:00:00"),
    });

    expect(saveProgress(state, storage)).toBe(true);
    expect(storage.read(PROGRESS_STORAGE_KEY)).toContain("persist");

    const restored = loadProgress(new Date("2026-10-29T10:00:00"), storage);
    expect(restored.xp).toBe(state.xp);
    expect(restored.streak).toBe(5);
    expect(restored.history).toHaveLength(1);
    expect(getBadgeStates(restored).find((badge) => badge.id === "b1")?.earned).toBe(
      true,
    );

    expect(clearStoredProgress(storage)).toBe(true);
    expect(storage.read(PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("bumabalik sa initial state kapag sira ang naka-save na JSON", () => {
    const storage = createMemoryStorage();
    storage.setItem(PROGRESS_STORAGE_KEY, "{not-json");

    const restored = loadProgress(new Date("2026-10-29T10:00:00"), storage);
    expect(restored.xp).toBe(1200);
    expect(restored.history).toEqual([]);
  });
});
