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
  type: "artifact_update";
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

// Union type of all possible chunks
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
  | CompletionChunk;

type Action = {
  id: string;
  message?: string;
  code?: {
    content: string;
    blockId: string;
    query_plan?: string;
    artifacts?: Array<{
      identifier: string;
      title: string;
      artifactType: string;
      data: unknown[];
    }>;
    output?: string[];
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

export function accumulateChunks(chunks: Chunk[]): ChunkResponse {
  const response: ChunkResponse = { interactions: [] };
  let currentInteractionId: string | null = null;
  let currentAction: Action | null = null;
  let pendingUserMessage: UserMessageChunk | null = null;

  for (const chunk of chunks) {
    // Store user message temporarily if we see it before an interaction
    if (chunk.type === "user_message") {
      pendingUserMessage = chunk;
    }

    if (chunk.type === "accept_interaction") {
      currentInteractionId = chunk.interaction_id;
      const newInteraction: Interaction = {
        id: chunk.interaction_id,
        threadId: chunk.thread_id,
        actions: [],
        chunks: [],
      };

      // Add the pending user message if it exists
      if (pendingUserMessage) {
        newInteraction.chunks.push(pendingUserMessage);
        pendingUserMessage = null;
      }

      response.interactions.push(newInteraction);
    }

    if (currentInteractionId) {
      const currentInteraction =
        response.interactions[response.interactions.length - 1];
      currentInteraction.chunks.push(chunk);

      // Handle action-related chunks
      if (chunk.type === "llm_call") {
        currentAction = { id: chunk.assistant_action_id! };
        currentInteraction.actions.push(currentAction);
      }

      // Update: Handle chunks even without matching action ID for filtered test cases
      if (currentAction) {
        switch (chunk.type) {
          case "assistant_message_response":
            if (!currentAction.message) {
              currentAction.message = "";
            }
            currentAction.message += chunk.message_chunk;
            break;
          case "assistant_code_response":
            if (!currentAction.code) {
              currentAction.code = {
                content: "",
                blockId: chunk.code_block_id!,
                artifacts: [],
                output: [],
              };
            }
            if (chunk.code_chunk) {
              currentAction.code.content += chunk.code_chunk;
            }
            if (chunk.query_plan_chunk) {
              currentAction.code.query_plan =
                currentAction.code.query_plan || "";
              currentAction.code.query_plan += chunk.query_plan_chunk;
            }
            break;
          case "code_output":
            if (currentAction.code) {
              if (!currentAction.code.output) {
                currentAction.code.output = [];
              }
              currentAction.code.output.push(chunk.output_chunk);
            }
            break;
        }
      }

      // Handle artifact updates by matching code_block_id
      if (chunk.type === "artifact_update" && chunk.code_block_id) {
        const actionWithCode = currentInteraction.actions.find(
          (action) => action.code?.blockId === chunk.code_block_id
        );
        if (actionWithCode?.code) {
          actionWithCode.code.artifacts = actionWithCode.code.artifacts || [];
          actionWithCode.code.artifacts.push({
            identifier: chunk.artifact.identifier,
            title: chunk.artifact.title,
            artifactType: chunk.artifact.artifact_type,
            data: chunk.artifact.data,
          });
        }
      }

      // Handle code output chunks by matching code_block_id
      if (chunk.type === "code_output" && chunk.code_block_id) {
        const actionWithCode = currentInteraction.actions.find(
          (action) => action.code?.blockId === chunk.code_block_id
        );
        if (actionWithCode?.code) {
          actionWithCode.code.output = actionWithCode.code.output || [];
          actionWithCode.code.output.push(chunk.output_chunk);
        }
      }
    }
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
