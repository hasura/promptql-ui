import { makeAssistantToolUI } from "@assistant-ui/react";
import { Text, Button } from "@radix-ui/themes";
import { Collapsible, ScrollArea } from "radix-ui";
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
  const [open, setOpen] = useState(false);
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
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              {icons[state]}
              <Text as="div" size="2">
                {labels[state]}
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
            <ScrollArea.Root className="h-[200px]">
              <ScrollArea.Viewport className="h-full">
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
                />
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            {args.output && (
              <>
                <div className="my-2 border-t" />
                <ScrollArea.Root className="h-[200px]">
                  <ScrollArea.Viewport className="h-full">
                    <CodeMirror
                      value={args.output}
                      height="200px"
                      editable={false}
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: false,
                        highlightActiveLine: false,
                      }}
                    />
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </>
            )}
            {args.error && (
              <>
                <div className="my-2 border-t" />
                <ScrollArea.Root className="h-[200px]">
                  <ScrollArea.Viewport className="h-full">
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
                    />
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

export const CodeToolUI = makeAssistantToolUI<CodeDisplayArgs, void>({
  toolName: "code_display",
  render: CodeDisplay,
});
