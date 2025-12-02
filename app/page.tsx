import Dashboard from "./Dashboard";
import { getLogsForUsers } from "@/lib/graph";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range = "30" } = await searchParams;
  const data = await getLogsForUsers(Number(range));
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard data={data} range={Number(range)} />;
    </div>
  );
}
