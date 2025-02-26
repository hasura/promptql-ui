import { makeAssistantToolUI } from "@assistant-ui/react";
import { BrainIcon, CheckIcon } from "lucide-react";

interface PlanDisplayArgs {
  plan: string;
}

const SimplePlanDisplay = ({
  args: rawArgs,
}: {
  args: PlanDisplayArgs | string;
}) => {
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border px-4 py-3">
      {args?.plan ? (
        <>
          <CheckIcon className="size-4" />
          <span className="text-sm">Planning complete</span>
        </>
      ) : (
        <>
          <BrainIcon className="size-4 animate-pulse" />
          <span className="text-sm">Planning in progress...</span>
        </>
      )}
    </div>
  );
};

export const SimplePlanToolUI = makeAssistantToolUI<PlanDisplayArgs, void>({
  toolName: "plan_display",
  render: SimplePlanDisplay,
});
