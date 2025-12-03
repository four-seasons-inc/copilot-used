"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import SummaryCards from "@/components/SummaryCards";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import UsageChart from "@/components/UsageChart";
import UserTable from "@/components/UserTable";
import { UserUsage } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard({ range }: { range: number }) {
  const [data, setData] = useState<UserUsage[]>([]);
  const getData = async (range: number) => {
    setLoading(true);
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/logs?range=${range}`
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData(range);
  }, [range]);

  return (
    <div className="min-h-screen bg-gray-50 relative p-6">
      <LoadingOverlay show={loading} />
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col lg:flex-row items-center justify-between gap-2">
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
          <h2 className="text-lg font-semibold mb-2">ユーザー別利用状況</h2>
          <UserTable data={data} />
        </div>
      </div>
    </div>
  );
}
