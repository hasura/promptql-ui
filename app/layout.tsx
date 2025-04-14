import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocalRuntimeProvider } from "@/app/components/LocalRuntimeProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptQL",
  description: "PromptQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className={`${inter.className} h-screen`}>
        <LocalRuntimeProvider>{children}</LocalRuntimeProvider>
      </body>
    </html>
  );
}
