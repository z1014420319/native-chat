import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Chat",
  description: "enjoy chat gpt",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <link rel="icon" href="/gpt_logo.png" sizes="any" />
      </head>
      <body className={`${inter.className} h-full w-full`}>
        <AuthProvider>{props.children}</AuthProvider>
      </body>
    </html>
  );
}
