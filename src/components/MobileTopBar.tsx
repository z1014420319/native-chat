import { useAiLoading } from "@/hooks/useAiLoading";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { cn } from "@/lib/utils";
import { MessageGroup } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function MobileTopBar(props: { groupId: string | null }) {
  const queryClient = useQueryClient();
  const messageGroups = queryClient.getQueryData([
    "messageGroups",
  ]) as MessageGroup[];
  const groupName = messageGroups.find((item) => {
    return item.groupId === props.groupId;
  })?.groupName;

  const isAiLoading = useAiLoading((state) => state.isAiLoading);

  const session = useSession();
  const email = session.data?.user?.email;
  const setIsOpenDialog = useAuthDialog((state) => state.setIsOpenDialog);

  return (
    <div className="md:hidden basis-11 shrink-0 bg-zinc-700 text-center flex items-center justify-center text-zinc-300 font-light relative">
      {groupName || "New chat"}
      <div className="absolute right-4">
        <Link
          href="/chat"
          replace
          className={cn("flex items-center", {
            "cursor-wait": isAiLoading,
          })}
          onClick={(e) => {
            if (!email) {
              setIsOpenDialog(true);
            }
            if (isAiLoading) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div className="h-1/3">
            <Plus className="ml-1 h-full" />
          </div>
        </Link>
      </div>
    </div>
  );
}
