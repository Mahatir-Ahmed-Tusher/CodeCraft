declare module 'react-resizable-panels' {
  import { ReactNode } from 'react';

  export interface ResizablePanelGroupProps {
    direction: 'horizontal' | 'vertical';
    children: ReactNode;
    className?: string;
  }

  export interface ResizablePanelProps {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    children: ReactNode;
    className?: string;
  }

  export interface ResizableHandleProps {
    className?: string;
  }

  export function ResizablePanelGroup(props: ResizablePanelGroupProps): JSX.Element;
  export function ResizablePanel(props: ResizablePanelProps): JSX.Element;
  export function ResizableHandle(props: ResizableHandleProps): JSX.Element;
}