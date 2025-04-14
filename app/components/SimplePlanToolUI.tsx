import { makeAssistantToolUI } from "@assistant-ui/react";
import {
  BrainIcon,
  CheckIcon,
  ChevronUpIcon,
  Maximize2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PlanDisplayArgs {
  plan: string;
}

const SimplePlanDisplay = ({
  args: rawArgs,
}: {
  args: PlanDisplayArgs | string;
}) => {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {args?.plan ? (
            <>
              <CheckIcon className="size-4" />
              <span className="text-sm font-medium">Planning complete</span>
            </>
          ) : (
            <>
              <BrainIcon className="size-4 animate-pulse" />
              <span className="text-sm font-medium">
                Planning in progress...
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="rounded-md p-1 hover:bg-gray-100"
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {args?.plan && (
          <div className="rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="markdown"
              style={oneDark}
              customStyle={{ margin: 0 }}
            >
              {args.plan}
            </SyntaxHighlighter>
          </div>
        )}
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
        {open && args?.plan && (
          <div className="border-t px-4 py-3">
            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language="markdown"
                style={oneDark}
                customStyle={{ margin: 0 }}
              >
                {args.plan}
              </SyntaxHighlighter>
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

export const SimplePlanToolUI = makeAssistantToolUI<PlanDisplayArgs, void>({
  toolName: "plan_display",
  render: SimplePlanDisplay,
});
