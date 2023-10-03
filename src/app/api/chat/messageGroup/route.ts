import { getSession } from "@/functions/getSeesion";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  const email = session?.user?.email;
  if (email) {
    const { groupId, groupName } = await req.json();
    const updatedGroup = await db.messageGroup.update({
      where: { groupId: groupId, useremail: email },
      data: {
        groupName,
      },
    });
    return NextResponse.json(updatedGroup);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  const email = session?.user?.email;
  if (email) {
    const { groupId } = await req.json();
    const deletedGroup = await db.messageGroup.delete({
      where: { groupId: groupId, useremail: email },
    });
    const messageIds = await db.message.findMany({
      where: { groupId: groupId, useremail: email },
      select: {
        id: true,
      },
    });
    await db.message.deleteMany({
      where: {
        id: {
          in: messageIds.map((item) => item.id),
        },
      },
    });
    return NextResponse.json(deletedGroup);
  }
}
