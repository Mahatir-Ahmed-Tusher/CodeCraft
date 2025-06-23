declare module '@lib/queryClient' {
  export function apiRequest(method: string, url: string, body?: any): Promise<Response>;
}