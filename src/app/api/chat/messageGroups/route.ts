import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/functions/getSeesion";
import { MessageGroup } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const email = session?.user?.email;
  let messageGroups: MessageGroup[] = [];
  if (email) {
    messageGroups = await db.messageGroup.findMany({
      where: {
        useremail: email,
      },
    });
  }
  return NextResponse.json(messageGroups, { status: 200 });
}
