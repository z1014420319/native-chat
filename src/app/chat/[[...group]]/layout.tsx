import { QueryProvider } from "@/providers/QueryClientProvider";

export default async function ChatLayout(props: { children: React.ReactNode }) {
  return <QueryProvider>{props.children}</QueryProvider>;
}
