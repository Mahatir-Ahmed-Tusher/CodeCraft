import { chatSession } from "@/configs/AiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({
                error: "Prompt is required"
            }, { status: 400 });
        }

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            return NextResponse.json({
                error: "API key not configured"
            }, { status: 500 });
        }

        const result = await chatSession.sendMessage(prompt);
        const AiResponse = await result.response.text();

        return NextResponse.json({
            result: AiResponse
        });
    } catch (err: any) {
        console.error("Error processing AI chat request:", err);
        
        // Handle specific error types
        if (err.message?.includes('API key')) {
            return NextResponse.json({
                error: "Invalid API key configuration"
            }, { status: 500 });
        }
        
        if (err.message?.includes('quota')) {
            return NextResponse.json({
                error: "API quota exceeded. Please try again later."
            }, { status: 429 });
        }

        return NextResponse.json({
            error: "Failed to process request. Please try again."
        }, { status: 500 });
    }
}