import { getLogsForUsers } from "@/lib/graph";
import { getSession } from "@/lib/session";
import Dashboard from "./Dashboard";
import Login from "./login";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await getSession();
  if (!session) return <Login />;
  const { range = "7" } = await searchParams;
  const data = await getLogsForUsers(Number(range));
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard data={data} range={Number(range)} />;
    </div>
  );
}
