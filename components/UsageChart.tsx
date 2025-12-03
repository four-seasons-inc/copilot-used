import type { UserUsage } from "@/types";
import { aggregateByAppClass, appClassToChartData } from "@/utils/agg";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function UsageChart({ data }: { data: UserUsage[] }) {
  const agg = aggregateByAppClass(data);
  const chartData = appClassToChartData(agg).slice(0, 10);

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-3">アプリ別合計使用数（上位）</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis type="number" />
            <YAxis dataKey="app" type="category" width={110} />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("ja-JP").format(value)
              }
            />
            <Bar dataKey="value" name="使用回数" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
