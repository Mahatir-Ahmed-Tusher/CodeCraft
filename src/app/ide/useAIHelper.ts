import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AIRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAIHelper() {
  const { toast } = useToast();

  const generateCodeMutation = useMutation({
    mutationFn: async (request: AIRequest) => {
      const response = await apiRequest('POST', '/api/ai/generate', request);
      const data = await response.json();
      return data.code;
    },
    onSuccess: () => {
      toast({
        title: "AI Generated",
        description: "Code has been generated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateCode = async (request: AIRequest): Promise<string> => {
    return generateCodeMutation.mutateAsync(request);
  };

  return {
    generateCode,
    isLoading: generateCodeMutation.isPending,
    error: generateCodeMutation.error,
  };
}
