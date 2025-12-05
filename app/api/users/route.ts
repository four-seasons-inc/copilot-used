import { getUsersFromDB } from "@/lib/graph";
import { getSession } from "@/lib/session";

export async function GET(_req: Request) {
  const ss = await getSession();
  if (!ss) return new Response("Unauthorized", { status: 401 });

  const data = await getUsersFromDB();

  return Response.json(data);
}
