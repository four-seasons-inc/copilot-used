import type { UserUsage, ByAppClass } from "@/types";

/**
 * 合計プロンプト数
 */
export function totalPrompts(users: UserUsage[]) {
  return users.reduce((s, u) => s + (u.promptTotal || 0), 0);
}

/**
 * 全ユーザーを集約して appClass ごとの合計を返す
 */
export function aggregateByAppClass(users: UserUsage[]) {
  const agg: ByAppClass = {};
  users.forEach((u) => {
    Object.entries(u.byAppClass || {}).forEach(([k, v]) => {
      agg[k] = (agg[k] || 0) + v;
    });
  });
  return agg;
}

/**
 * Recharts 用の配列データに変換
 */
export function appClassToChartData(agg: ByAppClass) {
  return Object.entries(agg)
    .map(([k, v]) => ({ app: prettifyAppClass(k), value: v }))
    .sort((a, b) => b.value - a.value);
}

/**
 * キーをわかりやすいラベルに変換
 */
export function prettifyAppClass(key: string) {
  const map: Record<string, string> = {
    webchat: "Webチャット",
    bizchat: "職場チャット",
    word: "Word",
    excel: "Excel",
    powerpoint: "PowerPoint",
    outlook: "Outlook",
    forms: "Forms",
    sharepoint: "SharePoint",
    teams: "Teams",
    m365admincenter: "管理センター",
    officecopilotsearchanswer: "検索回答",
  };
  const last = key.split(".").pop() || key;
  return map[last] || last;
}
