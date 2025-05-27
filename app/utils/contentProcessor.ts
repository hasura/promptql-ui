import { ThreadAssistantContentPart } from "@assistant-ui/react";

export interface PromptQLContent {
  text: string;
  plan: string;
  code: string;
  codeOutput: string;
  codeError: string;
  artifacts: unknown[];
}

interface PromptQLChunk {
  index?: number;
  message?: string;
  plan?: string;
  code?: string;
  code_output?: string;
  code_error?: string;
  type?: string;
  artifact?: unknown;
}

export function accumulatePromptQLContent(
  contentByIndex: Record<number, PromptQLContent>,
  chunk: PromptQLChunk
): PromptQLContent[] {
  const index = chunk.index || 0;

  // Initialize content for this index if needed
  if (!contentByIndex[index]) {
    contentByIndex[index] = {
      text: "",
      plan: "",
      code: "",
      codeOutput: "",
      codeError: "",
      artifacts: [],
    };
  }

  // Accumulate different content types for this index
  if (chunk.message) contentByIndex[index].text += chunk.message;
  if (chunk.plan) contentByIndex[index].plan += chunk.plan;
  if (chunk.code) contentByIndex[index].code += chunk.code;
  if (chunk.code_output) contentByIndex[index].codeOutput += chunk.code_output;
  if (chunk.code_error) contentByIndex[index].codeError += chunk.code_error;
  if (chunk.artifact) contentByIndex[index].artifacts.push(chunk.artifact);

  // Create content array for all messages up to and including current index
  return Object.entries(contentByIndex)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, content]) => content);
}

function cleanWarningText(text: string): string {
  // Remove artifact tags with warning disclaimers
  return text.replace(
    /<artifact identifier='[^']*' warning='I cannot see the full data so I must not make up observations' \/>/g,
    ''
  );
}

export function convertToAssistantContent(
  promptQLContent: PromptQLContent[]
): ThreadAssistantContentPart[] {
  // @ts-expect-error - content is not used in the tool call
  return promptQLContent.flatMap((content, idx) => {
    return [
      ...(content.text
        ? [
            {
              type: "text" as const,
              text: cleanWarningText(content.text),
            },
          ]
        : []),
      ...(content.plan
        ? [
            {
              type: "tool-call" as const,
              toolCallId: `plan-${idx + 1}`,
              toolName: "plan_display",
              args: {
                plan: content.plan,
                code: null,
                codeOutput: null,
              } as const,
            },
          ]
        : []),
      ...(content.code || content.codeError
        ? [
            {
              type: "tool-call" as const,
              toolCallId: `code-${idx + 1}`,
              toolName: "code_display",
              args: {
                code: content.code,
                codeOutput: content.codeOutput,
                plan: null,
                codeError: content.codeError,
              } as const,
            },
          ]
        : []),
      ...content.artifacts.map((artifact, artifactIdx) => ({
        type: "tool-call" as const,
        toolCallId: `artifact-${idx + 1}-${artifactIdx + 1}`,
        toolName: "artifact_display",
        args: {
          artifact: JSON.parse(JSON.stringify(artifact)),
          plan: null,
          code: null,
          codeOutput: null,
        } as const,
      })),
    ];
  });
}
