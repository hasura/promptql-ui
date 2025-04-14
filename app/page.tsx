"use client";

import { Thread } from "@assistant-ui/react-ui";
import { SimplePlanToolUI } from "./components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "./components/SimpleCodeToolUI";
import { ArtifactToolUI } from "./components/ArtifactToolUI";
export default function Home() {
  return (
    <main className="h-screen">
      <Thread
        tools={[SimplePlanToolUI, SimpleCodeToolUI, ArtifactToolUI]}
        assistantAvatar={{
          src: "/promptql.svg",
          alt: "PromptQL Logo",
        }}
      />
    </main>
  );
}
