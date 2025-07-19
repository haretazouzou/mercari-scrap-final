// lib/abTest.ts
export type ABGroup = "A" | "B";
export type SearchPattern = "AND" | "OR";

export function assignABGroup(): ABGroup {
  return Math.random() < 0.5 ? "A" : "B";
}

export function getCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export function getPatternForGroup(group: ABGroup, week: number): SearchPattern {
  if (week % 2 === 1) {
    return group === "A" ? "AND" : "OR";
  } else {
    return group === "A" ? "OR" : "AND";
  }
} 