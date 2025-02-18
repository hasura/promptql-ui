import type { Meta, StoryObj } from "@storybook/react";
import { Thread } from "@assistant-ui/react-ui";
import { MockRuntimeProvider } from "../app/components/MockRuntimeProvider";
import promptQLChunks from "../app/promptql-chunks.json";
import "../app/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import type { Chunk } from "../app/accumulateChunks";
import { PlanToolUI } from "../app/components/PlanToolUI";
import { CodeToolUI } from "../app/components/CodeToolUI";

const meta = {
  title: "Components/Thread",
  component: Thread,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-white">
        <MockRuntimeProvider>
          <Theme>
            <main className="h-full">
              <Story />
            </main>
          </Theme>
        </MockRuntimeProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Thread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="h-screen bg-white">
        <MockRuntimeProvider sampleChunks={promptQLChunks as Chunk[]}>
          <Theme>
            <main className="h-full">
              <Story />
            </main>
          </Theme>
        </MockRuntimeProvider>
      </div>
    ),
  ],
  args: {
    tools: [PlanToolUI, CodeToolUI],
  },
};
