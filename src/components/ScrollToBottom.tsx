import { ArrowDown } from "lucide-react";

export function ScrollToBottom(props: { bottomElement: HTMLElement | null }) {
  return (
    <div
      className="fixed right-9 bottom-32 aspect-square w-8 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500"
      onClick={() => {
        if (props.bottomElement) {
          props.bottomElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }}
    >
      <ArrowDown className="h-1/2" />
    </div>
  );
}
