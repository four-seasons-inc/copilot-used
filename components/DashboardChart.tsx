// DashboardChart.tsx
"use client";

import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import useSWR from "swr";
import { LogsApiResponse } from "@/types";
import LoadingOverlay from "./LoadingOverlay";
import UsageChart from "./UsageChart";
import UserTable from "./UserTable";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Props = {
  user: string;
  app: string;
  range: string;
  month: string;
};

const fetcher = async (url: string): Promise<LogsApiResponse> =>
  fetch(url).then((res) => res.json());

const DashboardChart: FC<Props> = ({ user, app, range, month }) => {
  const query = new URLSearchParams({
    user,
    app,
    range,
    month,
  }).toString();

  const { data, isLoading } = useSWR(`/api/logs/stats?${query}`, fetcher);
  const chartData = {
    labels: data?.chartData?.map((item) => item.date) ?? [],
    datasets: [
      {
        label: "Copilot AI 利用回数",
        data: data?.chartData?.map((item) => item.count) ?? [],
        borderWidth: 2,
      },
    ],
  };
  if (isLoading) return <LoadingOverlay show />;
  if (!data) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI 利用状況（日別）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <p className="text-sm">合計プロンプト数:</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("ja-JP").format(data.total)}
          </p>
        </div>
        <div className="h-[350px] w-full shadow p-2 rounded-md">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
        <div className="grid grid-cols-1">
          <UsageChart data={data.logs} />
        </div>
        <div>
          <UserTable data={data.logs} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
