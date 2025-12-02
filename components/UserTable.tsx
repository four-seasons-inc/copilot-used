import React, { useMemo, useState } from "react";
import type { UserUsage } from "@/types";
import { detectAnomaly } from "@/utils/anomaly";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { prettifyAppClass } from "@/utils/agg";

/**
 * シンプルなテーブル。shadcn の Table コンポーネントがあるなら置き換えてください。
 */
export default function UserTable({ data }: { data: UserUsage[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (u) =>
        u.displayName.toLowerCase().includes(s) ||
        u.userPrincipalName.toLowerCase().includes(s)
    );
  }, [data, q]);

  function downloadCSV() {
    const header = [
      "displayName",
      "userPrincipalName",
      "promptTotal",
      "topApps",
    ];
    const rows = filtered.map((u) => {
      const topApps = Object.entries(u.byAppClass || {})
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k.split(".").pop()}:${v}`)
        .join("|");
      return [
        u.displayName,
        u.userPrincipalName,
        String(u.promptTotal),
        topApps,
      ];
    });
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "copilot_usage.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4">
      <div className="flex gap-2 items-center mb-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="名前 または メールで検索..."
          className="border rounded px-3 py-2 flex-1"
        />
        <Button
          variant="default"
          onClick={downloadCSV}
          className="px-4 py-2 cursor-pointer"
        >
          CSV出力
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr>
              <th className="py-2">ユーザー</th>
              <th>メール</th>
              <th>使用回数</th>
              <th>上位アプリ (トップ3)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const topApps = Object.entries(u.byAppClass || {}).sort(
                (a, b) => b[1] - a[1]
              );

              return (
                <tr key={u.id} className={`border-t`}>
                  <td className="py-1 font-medium">{u.displayName}</td>
                  <td>{u.userPrincipalName}</td>
                  <td className="font-medium">
                    {u.promptTotal.toLocaleString()}
                  </td>
                  <td className="space-x-2">
                    {topApps.map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[11px] text-gray-600 border rounded px-1 p-0.5"
                      >
                        {prettifyAppClass(k)}({v})
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
