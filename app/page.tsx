"use client";

import { Thread } from "@assistant-ui/react-ui";
import { CodeToolUI } from "./components/CodeToolUI";
import { PlanToolUI } from "./components/PlanToolUI";

export default function Home() {
  return (
    <main className="h-screen">
      <Thread
        tools={[PlanToolUI, CodeToolUI]}
        assistantAvatar={{
          src: "/promptql.svg",
          alt: "PromptQL Logo",
        }}
      />
    </main>
  );
}
