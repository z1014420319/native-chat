import ChatModule from "@/components/ChatModule";
import { getSession } from "@/functions/getSeesion";
import { db } from "@/db";
import { notFound } from "next/navigation";
import ChatSideBar from "@/components/ChatSideBar";
import { Message, MessageGroup } from "@prisma/client";
import AuthDialog from "@/components/AuthDialog";

export default async function Chat(props: { searchParams: { id: string } }) {
  const session = await getSession();
  const email = session?.user?.email;
  let messages: Message[] = [];
  let messageGroups: MessageGroup[] = [];

  let messageGroupId = "";

  if (email) {
    messageGroupId = props.searchParams?.id || "";
    if (messageGroupId) {
      messages = await db.message.findMany({
        where: {
          groupId: messageGroupId,
          useremail: email,
        },
      });
      if (!messages) {
        notFound();
      }
    } else {
      messages = [];
    }
    messageGroups = await db.messageGroup.findMany({
      where: {
        useremail: email,
      },
    });
  }
  return (
    <div className={"flex w-full h-full items-stretch"}>
      <ChatSideBar messageGroups={messageGroups} />
      <ChatModule messages={messages} key={messageGroupId} />
      <AuthDialog />
    </div>
  );
}
