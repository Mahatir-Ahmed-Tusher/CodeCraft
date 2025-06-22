"use client";
import { createContext, Dispatch, SetStateAction, useState, ReactNode } from "react";

interface WorkspaceContextType {
  workspaceId: string | null;
  setWorkspaceId: Dispatch<SetStateAction<string | null>>;
  files: any;
  setFiles: Dispatch<SetStateAction<any>>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [files, setFiles] = useState<any>({});

  return (
    <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId, files, setFiles }}>
      {children}
    </WorkspaceContext.Provider>
  );
};