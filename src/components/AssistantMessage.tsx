import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AssistantMessage(props: { content: string }) {
  return (
    <div className="bg-zinc-100 border-y border-zinc-200 border">
      <div className="max-w-3xl flex mx-auto p-3 md:py-4">
        <Avatar>
          <AvatarImage src={"/gpt_logo.png"} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="pl-4 whitespace-break-spaces">{props.content}</div>
      </div>
    </div>
  );
}
