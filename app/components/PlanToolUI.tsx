import { makeAssistantToolUI } from "@assistant-ui/react";
import { Text, Button } from "@radix-ui/themes";
import { Collapsible } from "radix-ui";
import { ChevronUpIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

interface PlanDisplayArgs {
  plan: string;
}

const PlanDisplay = ({ args: rawArgs }: { args: PlanDisplayArgs | string }) => {
  const [open, setOpen] = useState(true);
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  if (!args?.plan) return null;

  return (
    <div className="mb-4 w-full rounded-lg border">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              <Text as="div" size="2">
                Query Plan
              </Text>
            </div>
            <ChevronUpIcon
              className="size-4"
              style={{
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 200ms",
              }}
            />
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="border-t px-4 py-3">
            <Text
              as="p"
              color="gray"
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
              }}
            >
              {args.plan}
            </Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

export const PlanToolUI = makeAssistantToolUI<PlanDisplayArgs, void>({
  toolName: "plan_display",
  render: PlanDisplay,
});
