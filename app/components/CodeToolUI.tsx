import { makeAssistantToolUI } from "@assistant-ui/react";
import { ChevronUpIcon, CodeIcon, PlayIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

interface CodeDisplayArgs {
  code: string;
  output?: string;
  error?: string;
}

type ExecutionState = "implementing" | "executing" | "executed";

// Custom theme definition
const customTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#4B5563",
    selection: "#036dd626",
    selectionMatch: "#036dd626",
    lineHighlight: "#8a91991a",
  },
  styles: [
    { tag: t.comment, color: "#787B8099" },
    { tag: t.variableName, color: "#0550AE" },
    { tag: t.string, color: "#1A7F37" },
    { tag: t.keyword, color: "#CF222E" },
    { tag: t.function(t.variableName), color: "#8250DF" },
  ],
});

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

  const codeEditorSetup = {
    lineNumbers: true,
    highlightActiveLineGutter: false,
    highlightActiveLine: false,
    foldGutter: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: true,
    rectangularSelection: true,
    highlightSelectionMatches: true,
    syntaxHighlighting: true,
  };

  return (
    <div className="mb-4 w-full rounded-lg border shadow-sm">
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 bg-gray-50/50"
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
            <div className="rounded-lg overflow-hidden border">
              <CodeMirror
                value={args.code}
                height="200px"
                extensions={[detectLanguage(args.code)]}
                editable={false}
                theme={customTheme}
                basicSetup={codeEditorSetup}
                onUpdate={(viewUpdate) => {
                  const scrollDom = viewUpdate.view.scrollDOM;
                  scrollDom.scrollTop = scrollDom.scrollHeight;
                }}
              />
            </div>
            {(args.output || state === "executing") && (
              <>
                <div className="my-2 border-t" />
                <div className="rounded-lg overflow-hidden border">
                  {args.output ? (
                    <CodeMirror
                      value={args.output}
                      height="200px"
                      editable={false}
                      theme={customTheme}
                      basicSetup={codeEditorSetup}
                      onUpdate={(viewUpdate) => {
                        const scrollDom = viewUpdate.view.scrollDOM;
                        scrollDom.scrollTop = scrollDom.scrollHeight;
                      }}
                    />
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <div className="h-full w-full animate-pulse rounded bg-gray-200" />
                    </div>
                  )}
                </div>
              </>
            )}
            {args.error && (
              <>
                <div className="my-2 border-t" />
                <div className="rounded-lg overflow-hidden border">
                  <CodeMirror
                    value={args.error}
                    height="200px"
                    editable={false}
                    theme={vscodeDark}
                    basicSetup={codeEditorSetup}
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
