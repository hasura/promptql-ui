import { makeAssistantToolUI } from "@assistant-ui/react";
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
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <CheckIcon className="size-4" />
          <span className="text-sm">Query Plan</span>
        </div>
        <ChevronUpIcon
          className="size-4 transition-transform duration-200"
          style={{
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-600">
            {args.plan}
          </p>
        </div>
      )}
    </div>
  );
};

export const PlanToolUI = makeAssistantToolUI<PlanDisplayArgs, void>({
  toolName: "plan_display",
  render: PlanDisplay,
});
