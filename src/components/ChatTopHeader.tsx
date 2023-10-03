import { MessageGroup } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, forwardRef, useState } from "react";

export default function ChatTopHeader(props: {
  messagesScrollTop: number;
  groupId: string | null;
}) {
  const headerContainerRef = useRef<HTMLDivElement>(null);

  const [lastMessagesScrollTop, setLastMessagesScrollTop] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLastMessagesScrollTop(props.messagesScrollTop);
    }, 10);
  }, [props.messagesScrollTop]);

  useEffect(() => {
    headerContainerRef.current?.scrollBy({
      top: props.messagesScrollTop - lastMessagesScrollTop,
    });
  }, [lastMessagesScrollTop]);

  const queryClient = useQueryClient();
  const messageGroups = queryClient.getQueryData([
    "messageGroups",
  ]) as MessageGroup[];
  const aiModelValue = messageGroups.find((item) => {
    return item.groupId === props.groupId;
  })?.aiModelValue;

  return (
    <div
      className="h-16 w-full absolute overflow-auto box-content pr-3 top-11 md:top-0"
      ref={headerContainerRef}
    >
      <div className="h-16 w-full flex items-center justify-center text-zinc-900 font-light text-sm border-1 border-zinc-200 border-b bg-white">
        {aiModelValue}
      </div>
      <div className="h-16 w-full"></div>
    </div>
  );
}
