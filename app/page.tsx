"use client";

import { Thread } from "@assistant-ui/react-ui";
import { SimplePlanToolUI } from "./components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "./components/SimpleCodeToolUI";
import { ArtifactToolUI } from "./components/ArtifactToolUI";
import { TableauProvider } from "./components/TableauProvider";
import { LocalRuntimeProvider } from "./components/LocalRuntimeProvider";
import { TableauStatus } from "./components/TableauStatus";

export default function Home() {
  return (
    <TableauProvider>
      <LocalRuntimeProvider>
        <main className="h-screen flex flex-col">
          <div className="flex-shrink-0">
            <TableauStatus />
          </div>
          <div className="flex-1 min-h-0">
            <Thread
              tools={[SimplePlanToolUI, SimpleCodeToolUI, ArtifactToolUI]}
              assistantAvatar={{
                src: "/promptql.svg",
                alt: "PromptQL Logo",
              }}
            />
          </div>
        </main>
      </LocalRuntimeProvider>
    </TableauProvider>
  );
}
