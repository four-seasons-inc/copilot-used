"use client";

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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export function AiInteractionChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const chartData = {
    labels: data.map((x) => x.date),
    datasets: [
      {
        label: "Interactions",
        data: data.map((x) => x.count),
      },
    ],
  };

  const options = {
    responsive: true,
    tension: 0.3,
  };

  return <Line data={chartData} options={options} />;
}
