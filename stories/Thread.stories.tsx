import type { Meta, StoryObj } from "@storybook/react";
import { Thread, AssistantMessage } from "@assistant-ui/react-ui";
import { LocalRuntimeProvider } from "../app/components/LocalRuntimeProvider";
import "../app/globals.css";
import { SimplePlanToolUI } from "../app/components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "../app/components/SimpleCodeToolUI";
import { ArtifactToolUI } from "../app/components/ArtifactToolUI";
import { http, HttpResponse } from "msw";

const createMockChatHandler = (mockFileName: string) => {
  return http.post("/api/chat", async () => {
    const lines = (
      await import(`../test/mocks/${mockFileName}?raw`)
    ).default.split("\n");
    const stream = new ReadableStream({
      async start(controller) {
        for (const line of lines) {
          if (!line.trim()) continue;
          controller.enqueue(new TextEncoder().encode(line + "\n"));
          await new Promise((resolve) => setTimeout(resolve, 10)); // Add delay to simulate streaming
        }
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
};

const meta = {
  title: "Components/Thread",
  component: Thread,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Thread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="h-screen">
        <LocalRuntimeProvider>
          <main className="h-full">
            <Story />
          </main>
        </LocalRuntimeProvider>
      </div>
    ),
  ],
  args: {
    tools: [SimplePlanToolUI, SimpleCodeToolUI, ArtifactToolUI],
    components: {
      AssistantMessage,
    },
    assistantAvatar: {
      src: "/promptql.svg",
      alt: "PromptQL Logo",
    },
  },
  parameters: {
    msw: {
      handlers: [createMockChatHandler("faulty-response.txt")],
    },
  },
};

export const AnotherResponse: Story = {
  ...Default,
  parameters: {
    msw: {
      handlers: [createMockChatHandler("another-response.txt")],
    },
  },
};

export const CRMRecords: Story = {
  ...Default,
  parameters: {
    msw: {
      handlers: [createMockChatHandler("crm-records.txt")],
    },
  },
};
