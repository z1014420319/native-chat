"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { MessageGroup } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { UserInfo } from "./UserInfo";
import { Separator } from "@/components/ui/separator";
import { MessageGroupItem } from "./MessageGroupItem";

import { Plus, PanelLeftInactive, AlignJustify } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiLoading } from "@/hooks/useAiLoading";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { useSession } from "next-auth/react";

export default function ChatSideBar(props: { messageGroups: MessageGroup[] }) {
  const isAiLoading = useAiLoading((state) => state.isAiLoading);
  const setIsOpenDialog = useAuthDialog((state) => state.setIsOpenDialog);

  const session = useSession();
  const email = session.data?.user?.email;

  const [showSideBar, setShowSideBar] = useState<boolean | undefined>(
    undefined
  );
  const [showCloseSideBarButton, setShowCloseSideBarButton] = useState<
    boolean | undefined
  >(undefined);

  const [deviceSize, setDeviceSize] = useState("");

  const router = useRouter();
  const search = useSearchParams();
  const currentMessageGroupId = search.get("id");

  const queryClient = useQueryClient();

  const { isSuccess, isError, isLoading, error, data } = useQuery({
    initialData: props.messageGroups,
    queryKey: ["messageGroups"],
    queryFn: async () => {
      const messageGroups = await fetch("/api/chat/messageGroups");
      return messageGroups.json();
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({
      groupId,
      groupName,
    }: {
      groupId: string;
      groupName: string;
    }) => {
      await fetch("/api/chat/messageGroup", {
        method: "PATCH",
        body: JSON.stringify({
          groupId,
          groupName,
        }),
      });
    },
    onSuccess(data, groupObj) {
      queryClient.setQueryData(
        ["messageGroups"],
        (oldMessageGroup: MessageGroup[] | undefined) => {
          let newMessageGroup: MessageGroup[] = [];
          if (oldMessageGroup) {
            newMessageGroup = oldMessageGroup.map((item) => {
              if (item.groupId === groupObj.groupId) {
                return {
                  ...item,
                  groupName: groupObj.groupName,
                };
              }
              return { ...item };
            });
          }
          return newMessageGroup;
        }
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await fetch("/api/chat/messageGroup", {
        method: "DELETE",
        body: JSON.stringify({
          groupId,
        }),
      });
    },
    onSuccess(data, groupId) {
      queryClient.setQueryData(["messages", null], () => {
        return [];
      });
      queryClient.setQueryData(["messages", groupId], () => {
        return [];
      });
      queryClient.setQueryData(
        ["messageGroups"],
        (oldMessageGroup: MessageGroup[] | undefined) => {
          let newMessageGroup: MessageGroup[] = [];
          if (oldMessageGroup) {
            newMessageGroup = oldMessageGroup.reduce((acc, item) => {
              if (item.groupId !== groupId) {
                newMessageGroup.push({
                  ...item,
                });
              }
              return acc;
            }, newMessageGroup);
          }
          return newMessageGroup;
        }
      );
      if (currentMessageGroupId === groupId) {
        router.replace("/chat");
      }
    },
  });

  useEffect(() => {
    function handleResize() {
      setShowSideBar(undefined);
      setShowCloseSideBarButton(undefined);
      setDeviceSize("");
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleResize);
    };
  }, []);

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (isLoading) {
    return <div>loding</div>;
  }
  if (isSuccess) {
    return (
      <div
        className={cn(
          "grow-0 shrink-0 basis-64 min-w-0 -ml-64 md:ml-0 flex flex-col bg-zinc-900 transition-all font-light text-sm relative",
          {
            "ml-0 ": showSideBar === undefined ? false : showSideBar,
            "-ml-64 md:-ml-64":
              showSideBar === undefined ? false : !showSideBar,
            "absolute h-full w-64 z-20": deviceSize === "sm",
          }
        )}
        onTransitionEnd={() => {
          if (showSideBar === undefined) {
            return;
          }
          if (!showSideBar) {
            setShowCloseSideBarButton(true);
          }
        }}
        onClickCapture={(e) => {
          if (isAiLoading) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className="flex m-2 mb-0 text-gray-300 items-center h-11">
          {/* <NewChatButton> */}
          <Link
            href="/chat"
            replace
            className={cn(
              "flex items-center h-full w-9/12 rounded outline-zinc-700 outline",
              {
                "cursor-wait": isAiLoading,
              }
            )}
            onClick={() => {
              if (!email) {
                setIsOpenDialog(true);
              }
            }}
          >
            <div className="h-1/3">
              <Plus className="ml-1 h-full" />
            </div>
            <div className="ml-2">New Chat</div>
          </Link>
          {/* </NewChatButton> */}
          {/* <hideSideBarButton> */}
          <div
            className="aspect-square h-full ml-3 flex items-center justify-center rounded outline-zinc-700 outline cursor-pointer"
            onClickCapture={(e) => {
              e.stopPropagation();
              if (showSideBar === undefined) {
                setDeviceSize("md");
              }
              setShowSideBar(false);
            }}
          >
            <PanelLeftInactive />
          </div>
          {/* </hideSideBarButton> */}
          {/* <showSideBarButton> */}
          {/* on md screen */}
          <div
            className={cn(
              "aspect-square h-11 hidden items-center justify-center rounded bg-zinc-50 hover:bg-zinc-100 text-zinc-500 cursor-pointer fixed top-2 left-3 z-10",
              {
                "sm:hidden md:flex":
                  showCloseSideBarButton === undefined
                    ? false
                    : showCloseSideBarButton,
                hidden:
                  showCloseSideBarButton === undefined
                    ? false
                    : !showCloseSideBarButton,
              }
            )}
            onClickCapture={(e) => {
              e.stopPropagation();
              if (showSideBar === undefined) {
                setDeviceSize("sm");
              }
              setShowSideBar(true);
              setShowCloseSideBarButton(false);
            }}
          >
            <PanelLeftInactive />
          </div>
          {/* on md screen */}
          {/* on sm screen */}
          <div
            className={cn(
              "aspect-square h-11 flex md:hidden items-center justify-center text-zinc-300 hover:text-zinc-800 cursor-pointer fixed top-0 left-0 z-10",
              {
                "flex md:hidden":
                  showCloseSideBarButton === undefined
                    ? false
                    : showCloseSideBarButton,
                hidden:
                  showCloseSideBarButton === undefined
                    ? false
                    : !showCloseSideBarButton,
              }
            )}
            onClickCapture={(e) => {
              e.stopPropagation();
              if (showSideBar === undefined) {
                setDeviceSize("sm");
              }
              setShowSideBar(true);
              setShowCloseSideBarButton(false);
            }}
          >
            <AlignJustify />
          </div>
          {/* on sm screen */}
          {/* </showSideBarButton> */}
        </div>

        <div className="grow overflow-scroll">
          {data.map((item: MessageGroup) => {
            return (
              <MessageGroupItem
                key={item.groupId}
                groupItem={item}
                deleteMutation={deleteMutation}
                renameMutation={renameMutation}
                currentItem={currentMessageGroupId || ""}
                // setCurrentItem={setCurrentItem}
                isAiLoading={isAiLoading}
              />
            );
          })}
        </div>

        <Separator className="mt-auto bg-zinc-700" />

        <UserInfo />
      </div>
    );
  }
}
