import type { UserUsage } from "@/types";
import { prettifyAppClass } from "@/utils/agg";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";

/**
 * シンプルなテーブル。shadcn の Table コンポーネントがあるなら置き換えてください。
 */
export default function UserTable({ data }: { data: UserUsage[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((u) => {
      return (
        u.displayName.toLowerCase().includes(s) ||
        u._id.toLowerCase().includes(s)
      );
    });
  }, [data, q]);
  const top = useMemo(() => {
    return data.reduce((p, c) => {
      Object.keys(c.byAppClass).forEach((k) => {
        if (!p[k] || p[k] < c.byAppClass[k]) p[k] = c.byAppClass[k];
      });
      return p;
    }, {} as Record<string, number>);
  }, [data]);

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
      return [u.displayName, u._id, String(u.promptTotal), topApps];
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
      <h2 className="text-lg font-semibold mb-2">ユーザー別利用状況</h2>
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
              <th className="p-2 w-28 truncate">ユーザー</th>
              <th className="px-2 w-36 truncate">メール</th>
              <th className="w-20 text-center truncate">使用回数</th>
              <th className="px-4">上位アプリ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const topApps = Object.entries(u.byAppClass || {}).sort(
                (a, b) => b[1] - a[1]
              );

              return (
                <tr key={u.id} className={`border-t`}>
                  <td className="p-1 w-28 truncate">{u.displayName}</td>
                  <td className="px-1 w-36 truncate">
                    {u._id.replace("@0004s.com", "")}
                  </td>
                  <td className="w-20 text-center truncate">
                    {u.promptTotal.toLocaleString()}
                  </td>
                  <td className="p-1 flex items-center flex-wrap gap-1">
                    {topApps.map(([k, v]) => (
                      <span
                        key={k}
                        className={cn(
                          "text-[11px] text-gray-600 border border-current/30 rounded px-2 p-0.5 flex items-center gap-1 w-max",
                          top[k] === v && "bg-yellow-600/80 text-white"
                        )}
                      >
                        {top[k] === v && (
                          <Sparkle className="relative size-3 text-yellow-100 shadow-2xl" />
                        )}
                        {prettifyAppClass(k)}({v})
                        {top[k] === v && (
                          <Sparkle className="relative size-3 text-yellow-100 shadow-2xl" />
                        )}
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
