import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth/next";

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
