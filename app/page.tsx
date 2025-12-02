import { getSession } from "@/lib/session";
import Dashboard from "./Dashboard";
import Login from "./login";
import axios from "axios";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const session = await getSession();
  if (!session) return <Login />;
  const { range = "7" } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard range={Number(range)} />;
    </div>
  );
}
