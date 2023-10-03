import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { cn } from "@/lib/utils";
import { AiModelValue } from "@/types/aiModelValue";
import { Sparkles, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

export function ChatModelTabs(props: {
  aiModelValue: AiModelValue;
  setAiModelValue: Dispatch<SetStateAction<AiModelValue>>;
}) {
  const setIsOpenDialog = useAuthDialog((state) => state.setIsOpenDialog);

  const session = useSession();
  const email = session.data?.user?.email;
  return (
    <Tabs
      value={props.aiModelValue}
      className="mt-6 "
      onValueChange={(value) => {
        if (!email && value === "GPT-4") {
          setIsOpenDialog(true);
          return;
        }
        props.setAiModelValue(value as AiModelValue);
      }}
    >
      <TabsList className="h-12 rounded-xl">
        <TabsTrigger value="GPT-3.5" className="h-full w-40 rounded-lg group">
          <Zap
            className={cn("h-3/5 group-hover:text-green-400", {
              "text-green-400": props.aiModelValue === "GPT-3.5",
            })}
          />
          <span className="group-hover:text-black">GPT-3.5</span>
        </TabsTrigger>
        <TabsTrigger value="GPT-4" className="h-full w-40 rounded-lg group">
          <Sparkles
            className={cn("h-3/5 group-hover:text-indigo-600", {
              "text-indigo-600": props.aiModelValue === "GPT-4",
            })}
          />
          <span className="group-hover:text-black">GPT-4</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
