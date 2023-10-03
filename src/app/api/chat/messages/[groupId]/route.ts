import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/functions/getSeesion";
import { db } from "@/db";
import { Message } from "@prisma/client";
export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  if (!params.groupId) {
    return NextResponse.json([]);
  }
  const session = await getSession();
  const email = session?.user?.email;
  let messages: Message[] = [];
  if (email) {
    messages = await db.message.findMany({
      where: {
        useremail: email,
        groupId: params.groupId,
      },
    });
  }
  return NextResponse.json(messages);
}
