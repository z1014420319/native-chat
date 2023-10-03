import { Input } from "@/components/ui/input";
import { useAiLoading } from "@/hooks/useAiLoading";
import { cn } from "@/lib/utils";
import { ChatRequestOptions } from "ai";
import { Loader, SendHorizontal } from "lucide-react";
import { useRef } from "react";

export function MessageInput(props: {
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  aiLoding: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  const isAiLoading = useAiLoading((state) => state.isAiLoading);
  return (
    <div className="bottom-0 px-2 h-28 w-full absolute bg-white">
      <form
        onSubmit={props.onSubmit}
        className="max-w-3xl mx-auto relative flex items-center"
        ref={form}
      >
        <Input
          value={props.value}
          onChange={props.onChange}
          placeholder="Send a message"
          className="w-full rounded-xl shadow-xl indent-2 h-14"
        />
        <button
          className={cn(
            "absolute right-3 h-3/5 text-gray-300 flex items-center justify-center aspect-square",
            {
              "bg-green-500 rounded-md text-white": props.value,
              "bg-white text-gray-300": isAiLoading,
            }
          )}
          type="submit"
          disabled={isAiLoading}
        >
          {!isAiLoading && <SendHorizontal className="h-1/2" />}
          {isAiLoading && <Loader className="h-1/2 animate-spin" />}
        </button>
      </form>
    </div>
  );
}
