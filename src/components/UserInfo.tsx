import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogIn, LogOut } from "lucide-react";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { signOut } from "next-auth/react";

export function UserInfo() {
  const session = useSession();
  const email = session.data?.user?.email || "";
  const image = session.data?.user?.image || "";

  return (
    <Popover>
      <PopoverTrigger
        className={
          "m-2 p-2 flex items-stretch hover:bg-zinc-800 rounded cursor-pointer font-bold"
        }
      >
        <div>
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center ml-3 text-gray-300 min-w-0">
          <span className="truncate">{email || "Guest"}</span>
        </div>
        <PopoverContent className="mb-3 w-60 bg-black border-none text-white py-2 px-0">
          {!email && <LogInButton />}
          {email && <LogOutButton />}
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}

function LogInButton() {
  const setIsOpenDialog = useAuthDialog((state) => state.setIsOpenDialog);

  return (
    <div
      className="cursor-pointer hover:bg-zinc-800 h-11 px-3 flex items-center"
      onClick={() => {
        setIsOpenDialog(true);
      }}
    >
      <LogIn className="h-2/5" />
      <span className="ml-2">Log in</span>
    </div>
  );
}

function LogOutButton() {
  return (
    <div
      className="cursor-pointer hover:bg-zinc-800 h-11 px-3 flex items-center"
      onClick={async () => {
        const result = await signOut({ callbackUrl: "/chat" });
      }}
    >
      <LogOut className="h-2/5" />
      <span className="ml-2">Log out</span>
    </div>
  );
}
