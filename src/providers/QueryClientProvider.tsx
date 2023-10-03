"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider(props: { children: React.ReactNode }) {
  const [client] = useState(new QueryClient());
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}
