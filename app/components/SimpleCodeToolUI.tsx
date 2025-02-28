import { makeAssistantToolUI } from "@assistant-ui/react";
import { CodeIcon, PlayIcon, CheckIcon } from "lucide-react";
import clsx from "clsx";
interface CodeDisplayArgs {
  code: string;
  codeOutput?: string;
  codeError?: string;
}

type ExecutionState = "implementing" | "executing" | "executed";

const SimpleCodeDisplay = ({
  args: rawArgs,
}: {
  args: CodeDisplayArgs | string;
}) => {
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  if (!args?.code) return null;

  // Determine execution state based on args
  let state: ExecutionState = "implementing";
  if (args.codeOutput || args.codeError) {
    state = "executed";
  } else if (args.code && !args.codeOutput) {
    state = "executing";
  }

  const icons = {
    implementing: <CodeIcon className="size-4" />,
    executing: <PlayIcon className="size-4 animate-pulse" />,
    executed: <CheckIcon className="size-4" />,
  };

  const labels = {
    implementing: "Implementing solution...",
    executing: "Executing code...",
    executed: "Code execution complete",
  };

  return (
    <div
      className={clsx(
        "mb-4 flex items-center gap-2 rounded-lg border px-4 py-3",
        state === "executing" && "animate-pulse"
      )}
    >
      {icons[state]}
      <span className="text-sm">{labels[state]}</span>
    </div>
  );
};

export const SimpleCodeToolUI = makeAssistantToolUI<CodeDisplayArgs, void>({
  toolName: "code_display",
  render: SimpleCodeDisplay,
});
