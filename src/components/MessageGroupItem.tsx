import { MessageSquare, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { MessageGroup } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export function MessageGroupItem(props: {
  groupItem: MessageGroup;
  deleteMutation: UseMutationResult<void, unknown, string, unknown>;
  renameMutation: UseMutationResult<
    void,
    unknown,
    {
      groupId: string;
      groupName: string;
    },
    unknown
  >;
  currentItem: string;
  setCurrentItem: (item: string) => void;
  globallyIsEditing: boolean;
  setGloballyIsEditing: (status: boolean) => void;
  isAiLoading: Boolean;
}) {
  const [currentIsEditing, setCurrentIsEditing] = useState(false);
  const [newMessageGroupName, setNewMessageGroupName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isCurrent = props.currentItem === props.groupItem.groupId;
  const currentIsloding =
    isCurrent &&
    (props.deleteMutation.isLoading || props.renameMutation.isLoading);

  function handleStartEdit(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIsEditing(true);
    setNewMessageGroupName(props.groupItem.groupName || "");
  }
  function handleCancle(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIsEditing(false);
    setNewMessageGroupName(props.groupItem.groupName || "");
  }

  const handleRenameConfirm = useCallback(
    function () {
      if (!currentIsEditing) return;
      setCurrentIsEditing(false);
      if (!newMessageGroupName) {
        setNewMessageGroupName(props.groupItem.groupName || "");
        return;
      }
      props.renameMutation.mutate({
        groupId: props.groupItem.groupId,
        groupName: newMessageGroupName,
      });
    },
    [
      currentIsEditing,
      newMessageGroupName,
      props.groupItem.groupId,
      props.renameMutation,
      props.groupItem.groupName,
    ]
  );

  function handleDelete(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    props.deleteMutation.mutate(props.groupItem.groupId);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessageGroupName(e.target.value);
  }

  useEffect(() => {
    document.addEventListener("click", handleRenameConfirm);
    return () => {
      document.removeEventListener("click", handleRenameConfirm);
    };
  }, [handleRenameConfirm]);

  useEffect(() => {
    if (currentIsEditing && inputRef.current) {
      inputRef.current.focus();
    }
    props.setGloballyIsEditing(currentIsEditing);
  }, [currentIsEditing]);

  return (
    <Link
      replace
      href={`/chat?id=${props.groupItem.groupId}`}
      className={cn(
        "h-11 flex group relative items-center text-gray-300 cursor-pointer m-2 mb-0 rounded hover:bg-zinc-800",
        {
          "cursor-wait": props.isAiLoading,
          "bg-zinc-800": isCurrent,
        }
      )}
      onClickCapture={(e) => {
        if (currentIsloding) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        if (props.globallyIsEditing) {
          e.stopPropagation();
          e.preventDefault();
          document.dispatchEvent(new Event("click"));
          return;
        }
        props.setCurrentItem(props.groupItem.groupId);
      }}
    >
      {currentIsloding && (
        <div className="absolute w-full h-full bg-zinc-900 opacity-40 cursor-wait">
          <Loader2 className="h-full mx-auto animate-spin" />
        </div>
      )}
      <div className="ml-1 flex h-1/3">
        <MessageSquare className="h-full" />
      </div>
      {!currentIsEditing && (
        <div className="truncate ml-1">{props.groupItem.groupName}</div>
      )}
      {currentIsEditing && (
        <input
          ref={inputRef}
          className="truncate mx-1 bg-zinc-800 outline-zinc-700"
          value={newMessageGroupName}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRenameConfirm();
            }
          }}
          onClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}

      {!currentIsEditing && (
        <div
          className={cn("ml-auto flex h-1/3 invisible group-hover:visible", {
            visible: isCurrent,
          })}
        >
          <Pencil
            className="hover:text-white h-full"
            onClick={handleStartEdit}
          />
          <Trash2 className="hover:text-white h-full" onClick={handleDelete} />
        </div>
      )}
      {currentIsEditing && (
        <div className="ml-auto flex h-1/3">
          <Check
            className="hover:text-white h-full"
            onClick={handleRenameConfirm}
          />
          <X className="hover:text-white h-full" onClick={handleCancle} />
        </div>
      )}
    </Link>
  );
}
