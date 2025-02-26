import type { Meta, StoryObj } from "@storybook/react";
import { Thread } from "@assistant-ui/react-ui";
import { MockLocalRuntimeProvider } from "../app/components/MockLocalRuntimeProvider";
import "../app/globals.css";
import promptQLResponse from "../test/mocks/promptql-response.json";
import { SimplePlanToolUI } from "../app/components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "../app/components/SimpleCodeToolUI";

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
        <MockLocalRuntimeProvider sampleChunks={promptQLResponse}>
          <main className="h-full">
            <Story />
          </main>
        </MockLocalRuntimeProvider>
      </div>
    ),
  ],
  args: {
    tools: [SimplePlanToolUI, SimpleCodeToolUI],
    assistantAvatar: {
      src: "/promptql.svg",
      alt: "PromptQL Logo",
    },
  },
};
