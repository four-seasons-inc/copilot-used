"use client";

import SummaryCards from "@/components/SummaryCards";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import UsageChart from "@/components/UsageChart";
import UserTable from "@/components/UserTable";
import { UserUsage } from "@/types";

export default function Dashboard({
  data,
  range,
}: {
  data: UserUsage[];
  range: number;
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Copilot 利用状況ダッシュボード
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              期間ごとの集計と、急増ユーザーの検出（Anomaly）
            </p>
          </div>

          <div>
            <TimeRangeSelector value={range} />
          </div>
        </header>

        <SummaryCards data={data} />

        <div className="grid grid-cols-1">
          <UsageChart data={data} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            ユーザー別利用状況（増減ハイライト: +50% 以上）
          </h2>
          <UserTable data={data} />
        </div>
      </div>
    </div>
  );
}
