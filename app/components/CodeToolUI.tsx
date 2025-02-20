import { makeAssistantToolUI } from "@assistant-ui/react";
import { ChevronUpIcon, CodeIcon, PlayIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";

interface CodeDisplayArgs {
  code: string;
  output?: string;
  error?: string;
}

type ExecutionState = "implementing" | "executing" | "executed";

const CodeDisplay = ({ args: rawArgs }: { args: CodeDisplayArgs | string }) => {
  const [open, setOpen] = useState(true);
  const args = typeof rawArgs === "string" ? JSON.parse(rawArgs).args : rawArgs;

  if (!args?.code) return null;

  // Simple language detection based on content
  const detectLanguage = (code: string) => {
    const lowerCode = code.toLowerCase();
    if (
      lowerCode.includes("def ") ||
      (lowerCode.includes("import ") && lowerCode.includes(":"))
    )
      return python();
    if (lowerCode.includes("select ") || lowerCode.includes("from "))
      return sql();
    if (code.trim().startsWith("{") || code.trim().startsWith("["))
      return json();
    return javascript(); // fallback
  };

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
    implementing: "Implementing",
    executing: "Executing",
    executed: "Executed",
  };

  return (
    <div className="mb-4 w-full rounded-lg border">
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            {icons[state]}
            <span className="text-sm">{labels[state]}</span>
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
            <div className="h-[200px] overflow-auto">
              <CodeMirror
                value={args.code}
                height="200px"
                extensions={[detectLanguage(args.code)]}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: false,
                  highlightActiveLine: false,
                }}
                onUpdate={(viewUpdate) => {
                  const scrollDom = viewUpdate.view.scrollDOM;
                  scrollDom.scrollTop = scrollDom.scrollHeight;
                }}
              />
            </div>
            {(args.output || state === "executing") && (
              <>
                <div className="my-2 border-t" />
                <div className="h-[200px] overflow-auto">
                  {args.output ? (
                    <CodeMirror
                      value={args.output}
                      height="200px"
                      editable={false}
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: false,
                        highlightActiveLine: false,
                      }}
                      onUpdate={(viewUpdate) => {
                        const scrollDom = viewUpdate.view.scrollDOM;
                        scrollDom.scrollTop = scrollDom.scrollHeight;
                      }}
                    />
                  ) : (
                    <div className="flex h-full flex-col gap-2">
                      {[...Array(1)].map((_, i) => (
                        <div
                          key={i}
                          className="h-full w-full animate-pulse rounded bg-gray-200"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {args.error && (
              <>
                <div className="my-2 border-t" />
                <div className="h-[200px] overflow-auto">
                  <CodeMirror
                    value={args.error}
                    height="200px"
                    editable={false}
                    theme="dark"
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: false,
                      highlightActiveLine: false,
                    }}
                    onUpdate={(viewUpdate) => {
                      const scrollDom = viewUpdate.view.scrollDOM;
                      scrollDom.scrollTop = scrollDom.scrollHeight;
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CodeToolUI = makeAssistantToolUI<CodeDisplayArgs, void>({
  toolName: "code_display",
  render: CodeDisplay,
});
