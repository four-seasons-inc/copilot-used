"use client";
import type { UserUsage } from "@/types";
import {
  aggregateByAppClass,
  prettifyAppClass,
  totalPrompts,
} from "@/utils/agg";

export default function SummaryCards({ data }: { data: UserUsage[] }) {
  const total = totalPrompts(data);
  const avg = data.length ? Math.round(total / data.length) : 0;
  const agg = aggregateByAppClass(data);
  const topAppKey =
    Object.entries(agg).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topApp = topAppKey ? prettifyAppClass(topAppKey) : "—";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500">合計プロンプト数（期間）</div>
        <div className="mt-2 text-2xl font-bold">
          {new Intl.NumberFormat("ja-JP").format(total)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          ユーザー数: {data.length}
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500">1人あたり平均</div>
        <div className="mt-2 text-2xl font-bold">
          {new Intl.NumberFormat("ja-JP").format(avg)}
        </div>
        <div className="text-xs text-gray-400 mt-1">プロンプト / ユーザー</div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500">最も使用されているアプリ</div>
        <div className="mt-2 text-2xl font-bold">{topApp}</div>
        <div className="text-xs text-gray-400 mt-1">合計使用回数順</div>
      </div>
    </div>
  );
}
