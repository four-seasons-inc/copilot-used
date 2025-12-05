import { getSession } from "@/lib/session";
import Dashboard from "./Dashboard";
import Login from "./login";

export default async function Page() {
  const session = await getSession();
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}
