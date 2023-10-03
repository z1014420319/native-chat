"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { XCircle } from "lucide-react";

export default function AuthDialog() {
  const AuthDialog = useAuthDialog((state) => state);
  return (
    <AlertDialog open={AuthDialog.isOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请登录</AlertDialogTitle>
          <AlertDialogDescription>
            <button
              className="flex items-center w-1/2 mx-auto bg-black py-2 px-4 rounded-lg cursor-pointer"
              onClick={() => {
                signIn("github", {
                  redirect: false,
                });
              }}
            >
              <Image
                src="/github_logo.png"
                width={32}
                height={32}
                alt="github_logo"
              />
              <div className="ml-4 grow text-white">使用Git Hub登陆</div>
            </button>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="my-2">
          <AlertDialogCancel
            onClick={() => {
              AuthDialog.setIsOpenDialog(false);
            }}
            className="border-none absolute top-0 right-0"
          >
            <XCircle />
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
