import { makeAssistantToolUI } from "@assistant-ui/react";
import {
  CodeIcon,
  PlayIcon,
  CheckIcon,
  ChevronUpIcon,
  Maximize2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {icons[state]}
          <span className="text-sm font-medium">{labels[state]}</span>
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="rounded-md p-1 hover:bg-gray-100"
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="typescript"
              style={oneDark}
              customStyle={{ margin: 0 }}
            >
              {args.code}
            </SyntaxHighlighter>
          </div>
          {args.codeOutput && (
            <div className="rounded-lg bg-gray-100 p-4">
              <h3 className="text-sm font-medium mb-2">Output:</h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-600">
                {args.codeOutput}
              </pre>
            </div>
          )}
          {args.codeError && (
            <div className="rounded-lg bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">Error:</h3>
              <pre className="text-sm whitespace-pre-wrap text-red-600">
                {args.codeError}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 w-full rounded-lg border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 bg-gray-50/50">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            {icons[state]}
            <span className="text-sm">{labels[state]}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="rounded-md p-1 hover:bg-gray-100"
            >
              <Maximize2Icon className="size-4" />
            </button>
            <ChevronUpIcon
              className="size-4 transition-transform duration-200"
              style={{
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          </div>
        </div>
        {open && (
          <div className="border-t px-4 py-3">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="typescript"
                  style={oneDark}
                  customStyle={{ margin: 0 }}
                >
                  {args.code}
                </SyntaxHighlighter>
              </div>
              {args.codeOutput && (
                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="text-sm font-medium mb-2">Output:</h3>
                  <pre className="text-sm whitespace-pre-wrap text-gray-600">
                    {args.codeOutput}
                  </pre>
                </div>
              )}
              {args.codeError && (
                <div className="rounded-lg bg-red-50 p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Error:
                  </h3>
                  <pre className="text-sm whitespace-pre-wrap text-red-600">
                    {args.codeError}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-[95vw] h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {renderContent()}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export const SimpleCodeToolUI = makeAssistantToolUI<CodeDisplayArgs, void>({
  toolName: "code_display",
  render: SimpleCodeDisplay,
});
