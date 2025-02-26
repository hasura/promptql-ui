"use client";

import { Thread } from "@assistant-ui/react-ui";
import { SimplePlanToolUI } from "./components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "./components/SimpleCodeToolUI";

export default function Home() {
  return (
    <main className="h-screen">
      <Thread
        tools={[SimplePlanToolUI, SimpleCodeToolUI]}
        assistantAvatar={{
          src: "/promptql.svg",
          alt: "PromptQL Logo",
        }}
      />
    </main>
  );
}
