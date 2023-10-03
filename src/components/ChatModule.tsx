"use client";

import { useChat } from "ai/react";
import { Message as VercelAiMessage } from "ai";
import { Message, MessageGroup } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MessageInput } from "./MessageInput";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { ScrollToBottom } from "./ScrollToBottom";
import { ChatModelTabs } from "./ChatModelTabs";
import ChatTopHeader from "./ChatTopHeader";
import { MobileTopBar } from "./MobileTopBar";
import { AiModelValue } from "@/types/aiModelValue";
import { useAiLoading } from "@/hooks/useAiLoading";
import { cn } from "@/lib/utils";

export default function Chat(props: { messages: Message[] }) {
  const search = useSearchParams();
  const messageGroupId = search.get("id");
  let latestMessageGroupId = messageGroupId;

  const bottomElement = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [messagesScrollTop, setMessagesScrollTop] = useState(0);

  const [aiModelValue, setAiModelValue] = useState<AiModelValue>("GPT-3.5");

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data,
    isSuccess,
    isError,
    error,
    isLoading: queryLoding,
  } = useQuery({
    initialData: props.messages,
    queryKey: ["messages", latestMessageGroupId],
    queryFn: async ({ queryKey }) => {
      const messages = await fetch(`/api/chat/messages/${queryKey[1]}`);
      return messages.json();
    },
    refetchOnWindowFocus: false,
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: aiLoding,
  } = useChat({
    initialMessages: data as VercelAiMessage[],

    body: { messageGroupId: latestMessageGroupId || "", aiModelValue },
    async onResponse(res) {
      latestMessageGroupId = res.headers.get("groupId") as string;
      const aiModelValue = res.headers.get("aiModelValue") as string;
      if (!latestMessageGroupId) {
        return;
      }
      if (!messageGroupId) {
        await queryClient.setQueryData(
          ["messageGroups"],
          (oldMessageGroup: MessageGroup[] | undefined) => {
            let newMessageGroup: MessageGroup[] = [];
            if (oldMessageGroup) {
              newMessageGroup = oldMessageGroup.map((item) => {
                return { ...item };
              });
            }
            newMessageGroup.push({
              groupId: latestMessageGroupId!,
              groupName: "new-chat",
              useremail: "",
              aiModelValue,
            });
            return newMessageGroup;
          }
        );
      }
    },
    async onFinish(message) {
      if (!latestMessageGroupId) {
        return;
      }
      if (!messageGroupId) {
        queryClient.invalidateQueries(["messageGroups"]);
        router.replace(`/chat?id=${latestMessageGroupId}`);
      }
    },
  });

  const setIsAiLoding = useAiLoading((state) => state.setIsAiLoding);
  const isAiLoading = aiLoding || queryLoding;

  useEffect(() => {
    setIsAiLoding(isAiLoading);
  }, [isAiLoading]);

  useEffect(() => {
    queryClient.setQueryData(
      ["messages", latestMessageGroupId],
      (old: VercelAiMessage[] | undefined) => {
        return messages.map((item) => ({
          id: item.id,
          content: item.content,
          role: item.role,
        }));
      }
    );
  }, [messages]);

  useEffect(() => {
    if (bottomElement.current) {
      bottomElement.current.scrollIntoView();
    }
  }, [data]);

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (queryLoding) {
    return <div>loding</div>;
  }
  if (isSuccess) {
    return (
      <main
        className={cn("grow flex flex-col items-stretch relative", {
          "cursor-wait": isAiLoading,
        })}
      >
        {data.length === 0 && (
          <div className="absolute w-full flex flex-col items-center top-7 md:top-0">
            <ChatModelTabs
              aiModelValue={aiModelValue}
              setAiModelValue={setAiModelValue}
            />
            <div className="text-4xl font-bold text-zinc-300 mt-24">
              ChatGPT
            </div>
          </div>
        )}
        <MobileTopBar groupId={latestMessageGroupId} />
        {data.length !== 0 && (
          <ChatTopHeader
            messagesScrollTop={messagesScrollTop}
            groupId={latestMessageGroupId}
          />
        )}
        <section
          className="grow overflow-auto"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setIsScrolling(
              target.scrollTop + target.clientHeight < target.scrollHeight
            );
            setMessagesScrollTop(target.scrollTop);
          }}
        >
          <div className="h-16">{/* place hoder */}</div>
          {data.map((m: VercelAiMessage) => {
            return m.role === "user" ? (
              <UserMessage content={m.content} key={m.id} />
            ) : (
              <AssistantMessage content={m.content} key={m.id} />
            );
          })}
          <div className="h-56" ref={bottomElement}>
            {/* place hoder */}
          </div>
          {isScrolling && (
            <ScrollToBottom bottomElement={bottomElement.current} />
          )}
        </section>
        <MessageInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          aiLoding={aiLoding}
        />
      </main>
    );
  }
}
