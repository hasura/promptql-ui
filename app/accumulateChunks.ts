// Base types for common properties
type BaseChunk = {
  type: string;
  assistant_action_id?: string;
  code_block_id?: string;
};

// Specific chunk types
type ClientInitChunk = BaseChunk & {
  type: "client_init";
  stream_llm_output: boolean;
  version: string;
  headers: {
    authorization: string;
    [key: string]: string;
  };
  ddn_headers: {
    [key: string]: string;
  };
};

type UserMessageChunk = BaseChunk & {
  type: "user_message";
  message: string;
  uploads: unknown[];
  timestamp: string;
};

type AcceptInteractionChunk = BaseChunk & {
  type: "accept_interaction";
  interaction_id: string;
  thread_id: string;
};

type TitleUpdatedChunk = BaseChunk & {
  type: "title_updated";
  title: string;
};

type LLMCallChunk = BaseChunk & {
  type: "llm_call";
};

type AssistantMessageResponseChunk = BaseChunk & {
  type: "assistant_message_response";
  message_chunk: string;
};

type AssistantCodeResponseChunk = BaseChunk & {
  type: "assistant_code_response";
  code_chunk: string | null | undefined;
  query_plan_chunk: string | null | undefined;
  code_block_id: string | null;
};

type AssistantResponseLLMUsageChunk = BaseChunk & {
  type: "assistant_response_llm_usage";
  usage: {
    provider: string;
    model: string;
    input_tokens: number;
    output_tokens: number;
  };
};

type ExecutingCodeChunk = BaseChunk & {
  type: "executing_code";
};

type CodeOutputChunk = BaseChunk & {
  type: "code_output";
  output_chunk: string;
};

type ArtifactUpdateChunk = BaseChunk & {
  type: "artifact_update_chunk";
  artifact: {
    identifier: string;
    title: string;
    artifact_type: string;
    data: unknown[];
  };
};

type CodeExecutionCompleteChunk = BaseChunk & {
  type: "code_execution_complete";
};

type CompletionChunk = BaseChunk & {
  type: "completion";
};

export type AssistantActionChunk = BaseChunk & {
  type: "assistant_action_chunk";
  message: string | null;
  plan: string | null;
  code: string | null;
  code_output: string | null;
  code_error: string | null;
  index: number;
};

// Update the Chunk type to include all possible chunk types
type Chunk =
  | ClientInitChunk
  | UserMessageChunk
  | AcceptInteractionChunk
  | TitleUpdatedChunk
  | LLMCallChunk
  | AssistantMessageResponseChunk
  | AssistantCodeResponseChunk
  | AssistantResponseLLMUsageChunk
  | ExecutingCodeChunk
  | CodeOutputChunk
  | ArtifactUpdateChunk
  | CodeExecutionCompleteChunk
  | CompletionChunk
  | AssistantActionChunk;

type Action = {
  id: string;
  message: string;
  index: number;
  plan?: string | null;
  code?: {
    content: string;
    output?: string[];
    error?: string;
  };
};

type Interaction = {
  id: string;
  threadId?: string;
  actions: Action[];
  chunks: Chunk[];
};

type ChunkResponse = {
  interactions: Interaction[];
};

// Add new function to parse streamed response
function parseStreamedResponse(responseLines: string[]): Chunk[] {
  return responseLines
    .filter((line) => line.startsWith("data: "))
    .map((line) => {
      const jsonStr = line.replace("data: ", "").trim();
      return JSON.parse(jsonStr) as Chunk;
    });
}

export function accumulateChunks(chunks: Chunk[] | string[]): ChunkResponse {
  // If input is string array, parse it first
  const parsedChunks: Chunk[] =
    typeof chunks[0] === "string"
      ? parseStreamedResponse(chunks as string[])
      : (chunks as Chunk[]);

  const response: ChunkResponse = { interactions: [] };
  let currentInteraction: Interaction | null = null;
  let currentAction: Action | null = null;
  let currentIndex: number | null = null;

  for (const chunk of parsedChunks) {
    // Skip chunks that are just artifact updates
    if (chunk.type === "artifact_update_chunk") {
      continue;
    }

    // Skip non-assistant-action chunks
    if (chunk.type !== "assistant_action_chunk") {
      continue;
    }

    const assistantChunk = chunk as AssistantActionChunk;
    const chunkIndex = assistantChunk.index ?? 0;

    // Initialize first interaction if needed
    if (!currentInteraction) {
      currentInteraction = {
        id: "default",
        actions: [],
        chunks: parsedChunks,
      };
      response.interactions.push(currentInteraction);
    }

    // If index changes or we don't have a current action, create a new one
    if (currentIndex !== chunkIndex || !currentAction) {
      if (currentAction) {
        // Remove any existing action with the same ID before adding
        currentInteraction.actions = currentInteraction.actions.filter(
          (a) => a.id !== currentAction!.id
        );
        // Only push if it has content
        if (currentAction.message || currentAction.plan || currentAction.code) {
          currentInteraction.actions.push(currentAction);
        }
      }

      // Check if we already have an action for this index
      const existingAction = currentInteraction.actions.find(
        (a) => a.index === chunkIndex
      );

      currentAction = existingAction || {
        id: `action_${chunkIndex}`,
        message: "",
        index: chunkIndex,
      };
      currentIndex = chunkIndex;
    }

    // Ensure currentAction is not null before using it
    if (!currentAction) continue;

    // Accumulate content
    if (assistantChunk.message) {
      currentAction.message =
        (currentAction.message || "") + assistantChunk.message;
    }
    if (assistantChunk.plan) {
      currentAction.plan = (currentAction.plan || "") + assistantChunk.plan;
    }
    if (
      assistantChunk.code ||
      assistantChunk.code_output ||
      assistantChunk.code_error
    ) {
      if (!currentAction.code) {
        currentAction.code = {
          content: "",
          output: [],
          error: undefined,
        };
      }
      if (assistantChunk.code) {
        currentAction.code.content =
          (currentAction.code.content || "") + assistantChunk.code;
      }
      if (
        assistantChunk.code_output &&
        !assistantChunk.code_output.includes("Stored table artifact")
      ) {
        // Initialize output array if needed
        if (!currentAction.code.output) {
          currentAction.code.output = [];
        }
        // Always append new output chunks
        currentAction.code.output.push(assistantChunk.code_output);
      }
      if (assistantChunk.code_error) {
        currentAction.code.error =
          (currentAction.code.error || "") + assistantChunk.code_error;
      }
    }
  }

  // Handle the final action
  if (
    currentAction &&
    currentInteraction &&
    (currentAction.message || currentAction.plan || currentAction.code)
  ) {
    currentInteraction.actions = currentInteraction.actions.filter(
      (a) => a.id !== currentAction!.id
    );
    currentInteraction.actions.push(currentAction);
  }

  return response;
}

// Added exports for types
export type {
  BaseChunk,
  Chunk,
  ChunkResponse,
  ClientInitChunk,
  UserMessageChunk,
  AcceptInteractionChunk,
  TitleUpdatedChunk,
  LLMCallChunk,
  AssistantMessageResponseChunk,
  AssistantCodeResponseChunk,
  AssistantResponseLLMUsageChunk,
  ExecutingCodeChunk,
  CodeOutputChunk,
  ArtifactUpdateChunk,
  CodeExecutionCompleteChunk,
  CompletionChunk,
  Action,
  Interaction,
};
