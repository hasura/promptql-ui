import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MyRuntimeProvider } from "@/app/MyRuntimeProvider";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

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
    <MyRuntimeProvider>
      <Theme>
        <html lang="en" className="h-full">
          <body className={`${inter.className} h-full`}>{children}</body>
        </html>
      </Theme>
    </MyRuntimeProvider>
  );
}
