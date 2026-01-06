"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserUsage } from "@/types";
import { aggregateByAppClass, appClassToChartData } from "@/utils/agg";
import { FC, useMemo } from "react";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  data: UserUsage[];
};

const UsageChart: FC<Props> = ({ data }) => {
  const agg = useMemo(() => aggregateByAppClass(data), [data]);
  const chartItems = useMemo(
    () => appClassToChartData(agg).slice(0, 10),
    [agg]
  );

  const chartData = {
    labels: chartItems.map((item) => item.app),
    datasets: [
      {
        label: "使用回数",
        data: chartItems.map((item) => item.value),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            new Intl.NumberFormat("ja-JP").format(ctx.parsed.x ?? 0),
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (tickValue) {
            return new Intl.NumberFormat("ja-JP").format(
              Number(tickValue) || 0
            );
          },
        },
      },
    },
  };

  return (
    <Card className="p-4 bg-white shadow mt-4">
      <CardHeader>
        <CardTitle className="text-lg">アプリ別合計使用数（上位）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
