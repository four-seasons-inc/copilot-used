import Dashboard from "./Dashboard";
import { getLogsForUsers } from "@/lib/graph";

export default async function Page() {
  const data = await getLogsForUsers();
  return <Dashboard logs={data} />;
}
