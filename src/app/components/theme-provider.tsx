"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessageContext } from "@/data/context/MessageContext";
import { WorkspaceContext } from "@/data/context/WorkspaceContext";

interface Message {
  role: string;
  content: string;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<any>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId, files, setFiles }}>
      <MessageContext.Provider value={{ messages, setMessages }}>
        <NextThemesProvider {...props}>
          {children}
        </NextThemesProvider>
      </MessageContext.Provider>
    </WorkspaceContext.Provider>
  );
}