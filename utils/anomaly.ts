/**
 * current: 現在の値
 * previous: 直前 period の値
 * threshold: 増加率の閾値（%）
 * 戻り値: 増加が threshold 以上なら true
 */
export function detectAnomaly(
  current: number,
  previous: number,
  threshold = 50
) {
  if (!previous || previous === 0) {
    // previous が 0 の場合、明確な比較ができないため false（要件に応じて true にする選択も可能）
    return false;
  }
  const growth = ((current - previous) / previous) * 100;
  return growth >= threshold;
}
