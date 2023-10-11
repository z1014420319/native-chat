import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/functions/getSeesion";
import { MessageGroup } from "@prisma/client";
import { AiModelValue } from "@/types/aiModelValue";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export const runtime = "edge";

export async function POST(req: Request) {
  const session = await getSession();
  const email = session?.user?.email;

  try {
    let {
      messages,
      messageGroupId,
      aiModelValue,
    }: { messages: any; messageGroupId: any; aiModelValue: AiModelValue } =
      await req.json();
    let isNewMessage = !messageGroupId;
    let newGroupObj: MessageGroup;
    if (email) {
      if (isNewMessage) {
        const newMessageGroup = await db.messageGroup.create({
          data: {
            useremail: email,
            aiModelValue,
          },
        });
        newGroupObj = newMessageGroup;
        messageGroupId = newMessageGroup.groupId;
      }
    }

    const response = await openai.chat.completions.create({
      model: aiModelValue === "GPT-3.5" ? "gpt-3.5-turbo" : "gpt-4",
      stream: true,
      messages,
      user: email || "Guest",
    });
    const stream = OpenAIStream(response, {
      onStart: async () => {
        if (email) {
          const latestMessage = messages[messages.length - 1];
          await db.message.create({
            data: {
              useremail: email,
              role: latestMessage.role,
              content: latestMessage.content,
              show: true,
              groupId: messageGroupId,
            },
          });
        }
      },
      onCompletion: async (completion: string) => {
        if (email) {
          await db.message.create({
            data: {
              useremail: email,
              role: "assistant",
              content: completion,
              show: true,
              groupId: messageGroupId,
            },
          });
          if (isNewMessage) {
            await db.messageGroup.update({
              where: {
                groupId: newGroupObj.groupId,
              },
              data: {
                groupName: completion.slice(0, 20),
              },
            });
          }
        }
      },
    });
    return new StreamingTextResponse(stream, {
      headers: {
        groupId: messageGroupId || "",
        groupName: newGroupObj!?.groupName as string,
        useremail: newGroupObj!?.useremail,
        aiModelValue,
        Connection: "Keep-Alive",
        "Keep-Alive": "timeout=5, max=1000",
      },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
