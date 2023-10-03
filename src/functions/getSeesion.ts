import { authOptions } from "@/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
export async function getSession() {
  return await getServerSession(authOptions);
}
