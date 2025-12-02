import { getLogsForUsers } from "@/lib/graph";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const ss = await getSession();
  if (!ss) return new Response("Unauthorized", { status: 401 });
  const { searchParams } = new URL(req.url);
  const range = Number(searchParams.get("range") ?? "7");

  const data = await getLogsForUsers(range);

  return Response.json(data);
}
