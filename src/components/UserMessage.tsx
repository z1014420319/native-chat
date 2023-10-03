import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function UserMessage(props: { content: string }) {
  const session = useSession();
  const image = session.data?.user?.image || "";
  return (
    <div className="">
      <div className="max-w-3xl flex mx-auto p-3 md:py-4">
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>G</AvatarFallback>
        </Avatar>
        <div className="pl-4">{props.content}</div>
      </div>
    </div>
  );
}
