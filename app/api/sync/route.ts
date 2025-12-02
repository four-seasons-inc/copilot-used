import { asyncDb } from "@/lib/graph";

export async function GET() {
  await asyncDb();
  return new Response("OK", { status: 200 });
}
