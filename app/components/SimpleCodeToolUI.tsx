import { makeAssistantToolUI } from "@assistant-ui/react";
import { CodeIcon, PlayIcon, CheckIcon } from "lucide-react";

interface CodeDisplayArgs {
  code: string;
  output?: string;
  error?: string;
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
  if (args.output || args.error) {
    state = "executed";
  } else if (args.code && !args.output) {
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
    <div className="mb-4 flex items-center gap-2 rounded-lg border px-4 py-3">
      {icons[state]}
      <span className="text-sm">{labels[state]}</span>
    </div>
  );
};

export const SimpleCodeToolUI = makeAssistantToolUI<CodeDisplayArgs, void>({
  toolName: "code_display",
  render: SimpleCodeDisplay,
});
